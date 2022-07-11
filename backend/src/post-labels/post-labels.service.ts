import { PostLabel } from './post-label.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { IPostLabel } from 'src/types/IPostLabel';

@Injectable()
export class PostLabelsService {
  constructor(
    @InjectRepository(PostLabel)
    private postLabelsRepository: Repository<PostLabel>,
  ) {}

  async create(postLabel: IPostLabel): Promise<PostLabel> {
    return await this.postLabelsRepository.save(postLabel);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.postLabelsRepository.delete(id);
  }
}
