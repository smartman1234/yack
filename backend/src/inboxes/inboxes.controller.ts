import { Controller, Get, Post, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express'
import { DeleteResult, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Inbox } from './inbox.entity';
import { InboxesService } from './inboxes.service'
import { IInbox } from '../types/IInbox'
import { Account } from '../accounts/account.entity';
import stripe from 'stripe';
import { STRIPE_REDIRECT_LOCAL, STRIPE_REDIRECT_LIVE } from '../constants'

@Controller('inboxes')
export class InboxesController {
  constructor(private readonly inboxesService: InboxesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('account/:accountId')
  async findAll(@Param('accountId') accountId, @Req() request: Request): Promise<Inbox[]> {
    try {
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const account: Partial<Account> = { id: accountId };
      const inboxes: Inbox[] = await this.inboxesService.findAll(account)

      return inboxes
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('account/:accountId/inbox/:id/customer_portal')
  async openCustomerPortal(@Param('accountId') accountId, @Param('id') id, @Req() request: Request): Promise<any> {
    try {
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      const inboxId: number = Number(id);
      const inbox: Inbox = await this.inboxesService.findOne(inboxId)
      const return_url: string = process.env.NODE_ENV == "dev" ? STRIPE_REDIRECT_LOCAL : STRIPE_REDIRECT_LIVE;
      const { customer } = inbox;

      if (!customer) throw('No customer ID')

      // Get our custome portal session
      const session = await stripe.billingPortal.sessions.create({
        customer,
        return_url,
      })

      // Return to the user
      return session
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('account/:accountId/inbox/:id')
  async findOne(@Param('id') accountId, @Param('id') id, @Body() inboxData: Inbox): Promise<Inbox> {
    try {
      return await this.inboxesService.findOne(Number(id))
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('account/:accountId/inbox')
  async create(@Param('accountId') accountId, @Body() values: any, @Req() request: Request): Promise<Inbox> {
    try {
      const requestUser: any = request.user;
      const userId: number = requestUser.user;
      const { name } = values;
      const partialInbox: IInbox = {
        name,
        slug: name.toLowerCase().split(' ').join('_'),
        account: { id: Number(accountId) },
      }

      const inbox: Inbox = await this.inboxesService.create(partialInbox);

      // Get the new inbox
      return inbox
    } catch(error) {
      if (error.code == "23505") {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      } else {
        throw(error);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('account/:accountId/inbox/:id')
  @HttpCode(200)
  async update(@Param('accountId') accountId, @Param('id') id, @Body() values: any, @Req() request: Request): Promise<UpdateResult> {
    try {
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      const inboxId: number = Number(id);
      const inbox: Inbox = await this.inboxesService.findOne(id);
      const { subscription, customer } = inbox;
      const requestUser: any = request.user;
      const userId: number = requestUser.user;

      // Explode the values
      const {
        name,
        description,
        image,
        website,
        slug,
        widget,
        form,
      } = values

      // Crreate out new inbox to save
      const inboxData: Partial<Inbox> = {
        id: inboxId,
        name,
        description,
        image,
        website,
        slug,
        widget,
        form,
      }

      // If there is a subscription
      // Then we update the meta data to the new slug
      // if (subscription && customer) await stripe.subscriptions.update(subscription, { metadata: { slug } })

      return await this.inboxesService.update(inboxData);
    } catch(error) {
      if (error.code == "23505") {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      } else {
        throw(error);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account/:accountId/inbox/:id')
  async delete(@Param('id') accountId, @Param('id') id): Promise<DeleteResult> {
    try {
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      const inboxId: number = Number(id)
      const inbox: Inbox = await this.inboxesService.findOne(inboxId);

      // Delete the customer & subscription
      await stripe.customers.del(inbox.customer);

      // Return the deletion
      return await this.inboxesService.delete(inboxId)
    } catch(error) {
      throw(error)
    }
  }
}
