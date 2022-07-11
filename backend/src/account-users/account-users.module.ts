import { Module } from '@nestjs/common';
import { AccountUsersService } from './account-users.service';
import { AccountUsersController } from './account-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUser } from './account-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountUser])],
  providers: [AccountUsersService],
  exports: [AccountUsersService],
  controllers: [AccountUsersController]
})
export class AccountUsersModule {}
