
import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../accounts/account.entity';
import { AccountsService } from '../accounts/accounts.service';
import { AccountUser } from '../account-users/account-user.entity';
import { AccountUsersService } from '../account-users/account-users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private accountsService: AccountsService,
    private accountUsersService: AccountUsersService,
  ) {}

  @Post('login')
  async login(@Request() req, @Body() body) {
    try {
      const { email, password } = body;
      const user: User = await this.authService.validateUser(email, password);
      const accountUsers: AccountUser[] = await this.accountUsersService.findAllAccounts(user);
      const token = await this.authService.authenticate(user);
      const accounts: any = accountUsers;

      return { token, accounts }
    } catch (e) {
      throw(e)
    }
  }

  @Post('signup')
  async signup(@Request() req, @Body() body) {
    try {
      const { email, name, password } = body;
      const partialUser: Partial<User> = {
        email,
        name,
        password,
      }

      // Create the default account & user
      const user: User = await this.usersService.create(partialUser);
      const account: Account = await this.accountsService.create(user);

      return { user, account };
    } catch (e) {
      throw(e)
    }
  }

  @Post('reset')
  async reset(@Request() req, @Body() body) {
    try {
      const { email } = body;

      return this.authService.reset(email);
    } catch (e) {
      throw(e)
    }
  }

  @Post('update')
  async update(@Request() req, @Body() body) {
    try {
      const { email, resetToken, password } = body;

      return this.authService.update(email, resetToken, password);
    } catch (e) {
      throw(e)
    }
  }
}
