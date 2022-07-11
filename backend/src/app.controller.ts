import { Controller, Post, Get, Put, Delete, Req, HttpCode, Body } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {
  }

  @Get('test')
  test(): any {
    return { yack: true }
  }
}
