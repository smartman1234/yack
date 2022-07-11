import { Controller, Get, Post as HTTPPost, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { PostsService } from './posts.service'
import { Post } from './post.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Inbox } from '../inboxes/inbox.entity';
import { IPost } from '../types/IPost';
import { ILabel } from '../types/ILabel';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { UseInterceptors, UploadedFile } from '@nestjs/common'
import { EventsService } from '../events/events.service';
import { PostLabelsService } from '../post-labels/post-labels.service';
import { PostLabel } from 'src/post-labels/post-label.entity';
import { Label } from 'src/labels/label.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postLabelsService: PostLabelsService,
  ) {}

  /**
   * Only one that returns irregular types
   * This returns posts that are unread
   * ⚠️ TODO: Formalise this into a type IUnreadPost maybe
   */
  @UseGuards(JwtAuthGuard)
  @Get(':inboxId/unread')
  async findAllUnread(@Param('inboxId') inboxId, @Req() request: Request): Promise<any[]> {
    try {
      const posts: any[] = await this.postsService.findAllUnread(inboxId)

      return posts
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':accountId/inbox/:inboxId/label/:labelId/:labelText')
  async findAllLabel(
    @Param('accountId') accountId,
    @Param('inboxId') inboxId,
    @Param('labelId') labelId,
    @Param('labelText') labelText,
    @Req() request: Request
  ): Promise<Post[]> {
    try {
      const { query } = request;
      const label: ILabel = {
        id: labelId,
        text: labelText,
      };
      const page: number = query.page ? Number(query.page) : 0
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const user: Partial<User> = { id: userId };
      const posts: Post[] = await this.postsService.findAllLabel(user, label, page, accountId, inboxId)

      return posts
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':accountId/inbox/:inboxId/status/:status')
  async findAllStatus(
    @Param('accountId') accountId,
    @Param('inboxId') inboxId,
    @Param('status') status,
    @Req() request: Request
  ): Promise<Post[]> {
    try {
      const { query } = request;
      const page: number = query.page ? Number(query.page) : 0
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const user: Partial<User> = { id: userId };
      const posts: Post[] = await this.postsService.findAllStatus(user, status, page, accountId, inboxId)

      return posts
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':accountId/inbox/:inboxId')
  async findAllInbox(
    @Param('accountId') accountId,
    @Param('inboxId') inboxId,
    @Req() request: Request
  ): Promise<Post[]> {
    try {
      const { query } = request;
      const page: number = query.page ? Number(query.page) : 0
      const inbox: Partial<Inbox> = { id: Number(inboxId) }
      const posts: Post[] = await this.postsService.findAllInbox(inbox, page, accountId)

      return posts
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id): Promise<Post> {
    try {
      const post: Post = await this.postsService.findOne(id)

      console.log(post)

      return post
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @HTTPPost()
  async create(@Body() values: any): Promise<Post> {
    try {
      const {
        status,
        title,
        description,
        email,
        name,
        inboxId,
      } = values
      const html = "<p>" + description + "</p>";
      const text = description;
      const post: IPost = {
        status,
        title,
        description,
        html,
        text,
        email,
        name,
        inbox: { id: Number(inboxId) },
      }

      // Get the new template
      return await this.postsService.create(post);
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id, @Body() values: any): Promise<UpdateResult> {
    try {
      const { post: { id, unread, status: { name } } } = values;
      const partialPost: Partial<Post> = <Partial<Post>>{ id, status: name, unread };

      return await this.postsService.update(partialPost);;
    } catch(error) {
      throw(error)
    }
  }
}
