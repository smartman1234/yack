import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountUsersService } from '../account-users/account-users.service';
import { AccountsService } from '../accounts/accounts.service';
import { LabelsService } from '../labels/labels.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { LabelsModule } from 'src/labels/labels.module';
import { AccountUsersModule } from 'src/account-users/account-users.module';
import { Account } from 'src/accounts/account.entity';
import { Label } from 'src/labels/label.entity';
import { AccountUser } from 'src/account-users/account-user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      User,
      Account,
      Label,
      AccountUser
    ]),
    UsersModule,
    AccountsModule,
    AccountUsersModule,
    LabelsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '14d' },
    }),
  ],
  providers: [
    UsersService,
    AccountsService,
    AccountUsersService,
    LabelsService,
    AuthService,
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
