import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/post.entity'
import { Inbox } from 'src/inboxes/inbox.entity';
import { InboxesService } from 'src/inboxes/inboxes.service';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/comment.entity';
import { PostLabel } from 'src/post-labels/post-label.entity';
import { PostLabelsService } from 'src/post-labels/post-labels.service';
import { AccountUsersService } from 'src/account-users/account-users.service';
import { AccountUser } from 'src/account-users/account-user.entity';
import { Account } from 'src/accounts/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Inbox, Comment, PostLabel, AccountUser, Account])],
  controllers: [WebhookController],
  providers: [PostsService, InboxesService, CommentsService, PostLabelsService, AccountUsersService, AccountsService]
})
export class WebhookModule {}
