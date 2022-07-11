import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { LabelsService } from '../labels/labels.service';
import { AccountsService } from '../accounts/accounts.service';
import { LabelsModule } from '../labels/labels.module';
import { AccountsModule } from '../accounts/accounts.module';
import { Repository } from 'typeorm';
import { Label } from 'src/labels/label.entity';
import { Account } from 'src/accounts/account.entity';
import { AccountUser } from 'src/account-users/account-user.entity';
import { AccountUsersService } from 'src/account-users/account-users.service';
import { AccountUsersModule } from 'src/account-users/account-users.module';

@Module({
  imports: [
    AccountsModule,
    AccountUsersModule,
    LabelsModule,
    TypeOrmModule.forFeature([
      User,
      Account,
      AccountUser,
      Label
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AccountsService,
    AccountUsersService,
    LabelsService
  ],
  exports: [UsersService],
})
export class UsersModule {}
