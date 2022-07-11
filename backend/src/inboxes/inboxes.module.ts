import { Module } from '@nestjs/common';
import { InboxesController } from './inboxes.controller';
import { InboxesService } from './inboxes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inbox } from './inbox.entity'
import { LabelsService } from 'src/labels/labels.service';
import { Label } from 'src/labels/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inbox])],
  controllers: [InboxesController],
  providers: [InboxesService],
  exports: [InboxesService]
})
export class InboxesModule {}
