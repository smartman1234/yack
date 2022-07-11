import { Test, TestingModule } from '@nestjs/testing';
import { InboxesService } from './inboxes.service';

describe('InboxesService', () => {
  let service: InboxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InboxesService],
    }).compile();

    service = module.get<InboxesService>(InboxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
