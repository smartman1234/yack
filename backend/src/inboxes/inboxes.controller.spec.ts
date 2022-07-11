import { Test, TestingModule } from '@nestjs/testing';
import { InboxesController } from './inboxes.controller';

describe('Inboxes Controller', () => {
  let controller: InboxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InboxesController],
    }).compile();

    controller = module.get<InboxesController>(InboxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
