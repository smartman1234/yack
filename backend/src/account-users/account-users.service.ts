import { Injectable } from '@nestjs/common';
import { AccountUser } from './account-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, MoreThan, LessThan } from 'typeorm';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';

@Injectable()
export class AccountUsersService {
  constructor(
    @InjectRepository(AccountUser)
    private accountUserRepository: Repository<AccountUser>,
  ) {}

  async create(user: User, account: Account): Promise<AccountUser> {
    const accountUser: Partial<AccountUser> = { user, account };

    return await this.accountUserRepository.save(accountUser);
  }

  async findAllUsers(account: Account): Promise<AccountUser[]> {
    return await this.accountUserRepository.find({
      where: { account },
      relations: ["user"]
    });
  }

  async findAllAccounts(user: User): Promise<AccountUser[]> {
    return await this.accountUserRepository.find({
      where: { user },
      relations: ["account"]
    });
  }
}
