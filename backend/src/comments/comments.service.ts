import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity'
import { Post } from '../posts/post.entity'
import { IComment } from '../types/IComment'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findAll(post: Partial<Post>): Promise<Comment[]> {
    return await this.commentsRepository.find({ post })
  }

  async findOne(id: number): Promise<Comment> {
    return await this.commentsRepository.findOne(id);
  }

  async create(comment: IComment): Promise<Comment> {
    return await this.commentsRepository.save(comment);
  }

  async update(comment: Partial<Comment>): Promise<UpdateResult> {
    return await this.commentsRepository.update(comment.id, comment);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.commentsRepository.delete(id);
  }
}
