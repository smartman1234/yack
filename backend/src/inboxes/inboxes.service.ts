import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Inbox } from './inbox.entity'
import { User } from '../users/user.entity'
import { IInbox } from '../types/IInbox'
import { Account } from '../accounts/account.entity';
import { Label } from 'src/labels/label.entity';

@Injectable()
export class InboxesService {
  constructor(
    @InjectRepository(Inbox)
    private inboxesRepository: Repository<Inbox>
  ) {}

  async findAll(account: Partial<Account>): Promise<Inbox[]> {
    return await this.inboxesRepository.find({ account });
  }

  async findOne(id: number): Promise<Inbox> {
    return await this.inboxesRepository.findOne(id);
  }

  async findOneWithSlug(slug: string): Promise<Inbox> {
    return await this.inboxesRepository.findOne({
      where: { slug },
      relations: ["account"]
    });
  }

  async findOneWithCustomer(customer: string): Promise<Inbox> {
    return await this.inboxesRepository.findOne({
      where: { customer }
    });
  }

  async findOneWithSlugForWidget(slug: string): Promise<any> {
    const rows = await this.inboxesRepository.query(`
      SELECT
        "inbox"."id",
        "inbox"."active",
        "inbox"."name",
        "inbox"."form",
        "inbox"."widget",
        ARRAY_AGG("l"."text") as "labelTexts",
        ARRAY_AGG("l"."id") as "labelIds"
      FROM
        "inbox" "inbox"
        LEFT JOIN "label" "l" ON "l"."inboxId" = "inbox"."id"
      WHERE
        "inbox"."slug" = '${slug}'
      GROUP BY
        "inbox"."id"
  `);

    return rows[0]
  }

  async create(inbox: IInbox): Promise<Inbox> {
    return await this.inboxesRepository.save(inbox);
  }

  async update(inbox: Partial<Inbox>): Promise<UpdateResult> {
    return await this.inboxesRepository.update(inbox.id, inbox);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.inboxesRepository.delete(id);
  }
}
