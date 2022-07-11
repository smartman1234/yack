import { Test, TestingModule } from '@nestjs/testing';
import { PostLabelsController } from './post-labels.controller';

describe('PostLabels Controller', () => {
  let controller: PostLabelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostLabelsController],
    }).compile();

    controller = module.get<PostLabelsController>(PostLabelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
