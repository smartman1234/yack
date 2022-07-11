import { Test, TestingModule } from '@nestjs/testing';
import { PostLabelsService } from './post-labels.service';

describe('PostLabelsService', () => {
  let service: PostLabelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostLabelsService],
    }).compile();

    service = module.get<PostLabelsService>(PostLabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
