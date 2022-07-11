import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './post.entity'
import { PostLabelsService } from 'src/post-labels/post-labels.service';
import { PostLabel } from 'src/post-labels/post-label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLabel])],
  controllers: [PostsController],
  providers: [PostsService, PostLabelsService]
})
export class PostsModule {}
