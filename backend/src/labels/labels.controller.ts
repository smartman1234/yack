import { Controller, Get, Post as HTTPPost, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { LabelsService } from './labels.service'
import { Label } from './label.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Inbox } from '../inboxes/inbox.entity';
import { IPost } from '../types/IPost';
import { ILabel } from '../types/ILabel';
import { IAccount } from '../types/IAccount';
import { Account } from '../accounts/account.entity'

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':inboxId')
  async findAllLabel(@Param('inboxId') inboxId, @Req() request: Request): Promise<Label[]> {
    try {
      const { query } = request;
      const inbox: Partial<Inbox> = { id: Number(inboxId) };
      const labels: Label[] = await this.labelsService.findAll(inbox)

      return labels
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('inbox/:inboxId/label/:id')
  async delete(@Param('id') inboxId, @Param('id') id): Promise<DeleteResult> {
    try {
      return await this.labelsService.delete(Number(id))
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @HTTPPost('inbox/:inboxId/label')
  async create(@Param('inboxId') inboxId, @Body() values: any, @Req() request: Request): Promise<Label> {
    try {
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const { text } = values;
      const label: ILabel = {
        text,
        inbox: { id: Number(inboxId) },
      }

      // Get the new inbox
      return await this.labelsService.create(label);
    } catch(error) {
      throw(error);
    }
  }
}
