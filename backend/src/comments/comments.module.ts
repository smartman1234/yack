import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity'
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, PostsService],
  exports: [CommentsService]
})
export class CommentsModule {}
