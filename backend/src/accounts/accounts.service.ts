import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, MoreThan, LessThan } from 'typeorm';
import { User } from '../users/user.entity';
import { AccountUsersService } from 'src/account-users/account-users.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private accountUsersService: AccountUsersService,
  ) {}

  async create(user: User): Promise<Account> {
    const partialAccount: Partial<Account> = { name: user.name };
    const account = await this.accountRepository.save(partialAccount);

    await this.accountUsersService.create(user, account);

    return account
  }

  async findOne(id: number): Promise<Account> {
    return await this.accountRepository.findOne(id);
  }
}
