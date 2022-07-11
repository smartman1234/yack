import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUser } from 'src/account-users/account-user.entity';
import { AccountUsersService } from 'src/account-users/account-users.service';
import { AccountUsersModule } from 'src/account-users/account-users.module';

@Module({
  imports: [
    AccountUsersModule,
    TypeOrmModule.forFeature([
      Account,
      AccountUser
    ]
  )],
  providers: [AccountsService, AccountUsersService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
