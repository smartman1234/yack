import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Label } from './label.entity'
import { Inbox } from '../inboxes/inbox.entity';
import { DEFAULT_LABELS } from '../constants';
import { ILabel } from '../types/ILabel';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private labelsRepository: Repository<Label>,
  ) {}

  async findAll(inbox: Partial<Inbox>): Promise<Label[]> {
    return await this.labelsRepository.find({ inbox });
  }

  async createDefaultAccountLabels(inbox: Inbox): Promise<boolean> {
    await Promise.all(DEFAULT_LABELS.map(labelText => {
      const label: Partial<Label> = { text: 'Default', inbox };

      return this.labelsRepository.save(label);
    }))

    return true;
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.labelsRepository.delete(id);
  }

  async create(label: ILabel): Promise<Label> {
    return await this.labelsRepository.save(label);
  }
}
