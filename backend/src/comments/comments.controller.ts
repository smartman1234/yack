import { Controller, Get, Post as HTTPPost, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { DeleteResult, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service'
import { IComment } from '../types/IComment'
import { generateUniqueMessageId } from 'src/util';
import { send, setApiKey } from '@sendgrid/mail';
import { PostsService } from 'src/posts/posts.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {
    setApiKey(process.env.SENDGRID_API_KEY);
  }

  @UseGuards(JwtAuthGuard)
  @Get('post/:pid')
  async findAll(@Param('pid') pid, @Req() request: Request): Promise<Comment[]> {
    try {
      const postId: number = Number(pid)
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const user: Partial<User> = { id: userId };
      const post: Partial<Post> = { id: postId };
      const comments: Comment[] = await this.commentsService.findAll(post)

      return comments
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id, @Body() commentData: Comment): Promise<Comment> {
    try {
      return await this.commentsService.findOne(Number(id))
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @HTTPPost()
  async create(@Body() values: any, @Req() request: Request): Promise<Comment> {
    try {
      const { text, post: { id, title, email, name, inbox } } = values;
      const html = "<p>" + text + "</p>";
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const messageId: string = generateUniqueMessageId();
      const comment: IComment = {
        text,
        html,
        description: text,
        messageId,
        unread: true,
        post: { id: Number(id) },
      }

      // FIND ONE WITH ALL COMMENTS!!!!
      const post: Post = await this.postsService.findOne(id);
      const { latestMessageId, comments } = post;
      const inReplyTo: string = latestMessageId ? `<${latestMessageId}>` : `<${post.messageId}>`

      // The comments here are sorted in DESC order - so we need to reverse them
      const references: string = `<${post.messageId}> ` + comments.reverse().map((comment: Comment) => `<${comment.messageId}>`).join(" ")
      const image = !!inbox.image ? inbox.image : "https://yack.app/assets/logo.png";

      // the In-Reply-To & References doesn't necessarily is TBC here
      // See the comment below 🚨
      const mail: any = {
        to: email,
        from: 'inbox@yack.app',
        reply_to: inbox.slug + '@inbox.yack.app',
        text: 'template',
        html: 'template',
        templateId: 'd-5571ac4e60e1412788672d314c90c339',
        headers: {
          "In-Reply-To": inReplyTo,
          "References": references,
          "Message-ID": messageId,
        },
        dynamicTemplateData: {
          name,
          email,
          text,
          image,
          subject: title,
        }
      }

      // Send the mail
      await send(mail);

      // Get the new comment
      return await this.commentsService.create(comment);
    } catch(error) {
      console.log(error.response.body)
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id, @Body() values: any, @Req() request: Request): Promise<UpdateResult> {
    try {
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const { text } = values
      const commentData: Partial<Comment> = {
        id: Number(id),
        text,
      }

      return this.commentsService.update(commentData);
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id): Promise<DeleteResult> {
    try {
      return await this.commentsService.delete(Number(id))
    } catch(error) {
      throw(error)
    }
  }
}
