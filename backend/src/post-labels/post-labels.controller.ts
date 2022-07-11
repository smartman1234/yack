import { Controller, Get, Post as HTTPPost, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
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
import { Post } from 'src/posts/post.entity';
import { IPostLabel } from 'src/types/IPostLabel';

@Controller('post-labels')
export class PostLabelsController {
  constructor(
    private readonly postLabelsService: PostLabelsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id, @Body() values: any): Promise<DeleteResult> {
    try {
      return await this.postLabelsService.delete(Number(id))
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @HTTPPost()
  @HttpCode(200)
  async create(@Body() values: any): Promise<PostLabel> {
    try {
      const { post, label } = values;
      const postLabel: IPostLabel = <IPostLabel>{
        post,
        label
      };

      return await this.postLabelsService.create(postLabel);
    } catch(error) {
      throw(error)
    }
  }
}
