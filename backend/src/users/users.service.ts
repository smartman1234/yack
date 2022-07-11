import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, MoreThan, LessThan } from 'typeorm';
import { User } from './user.entity';
import { hash, compare } from 'bcryptjs';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { Label } from '../labels/label.entity';
import { AccountsService } from '../accounts/accounts.service';
import { LabelsService } from '../labels/labels.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private accountsService: AccountsService,
    private labelsService: LabelsService,
  ) {}

  async update(user: User): Promise<any> {
    if (user.password) user.password = await hash(user.password, 10);

    return await this.usersRepository.update(user.id, user);
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findOneWithEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }

  async findOneWithEmailAndResetToken(email: string, resetToken: string): Promise<User> {
    return await this.usersRepository.findOne({ email, resetToken });
  }

  async create(partialUser: Partial<User>): Promise<User> {
    try {
      partialUser.password = await hash(partialUser.password, 10);

      return await this.usersRepository.save(partialUser);
    } catch(e) {
      throw(e)
    }
  }
}
