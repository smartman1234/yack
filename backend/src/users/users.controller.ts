import { Controller, Get, Post, Put, Delete, Req, HttpCode, Body, Param, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { DeleteResult, UpdateResult } from 'typeorm';
import { UsersService } from './users.service'
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as moment from "moment";

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
}
