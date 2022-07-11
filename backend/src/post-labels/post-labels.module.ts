import { Module } from '@nestjs/common';
import { PostLabelsService } from './post-labels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLabelsController } from './post-labels.controller';
import { PostLabel } from './post-label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLabel])],
  providers: [PostLabelsService],
  controllers: [PostLabelsController]
})
export class PostLabelsModule {}
