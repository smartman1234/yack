import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsController } from './labels.controller';
import { Label } from './label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  providers: [LabelsService],
  controllers: [LabelsController],
  exports: [LabelsService]
})
export class LabelsModule {}
