import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { InboxesModule } from './inboxes/inboxes.module';
import { CommentsModule } from './comments/comments.module';
import { LabelsModule } from './labels/labels.module';
import { PostLabelsModule } from './post-labels/post-labels.module';
import { AccountsModule } from './accounts/accounts.module';
import { AccountUsersModule } from './account-users/account-users.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessagesModule } from './messages/messages.module';
import { WebhookModule } from './webhook/webhook.module';
import { RavenModule, RavenInterceptor } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    RavenModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    InboxesModule,
    CommentsModule,
    LabelsModule,
    PostLabelsModule,
    AccountsModule,
    AccountUsersModule,
    UploadModule,
    MessagesModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
})
export class AppModule {}
