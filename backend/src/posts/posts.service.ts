import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Inbox } from 'src/inboxes/inbox.entity';
import { IPost } from '../types/IPost';
import { ILabel } from '../types/ILabel';
import { PAGE_SIZE } from '../constants';
import { PostLabel } from '../post-labels/post-label.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAllUnread(inboxId: number): Promise<any> {
    const SQL_ROWS = `
      SELECT
        "post"."id",
        "post"."status",
        "inbox"."id" as "inboxId"
      FROM
        "post" "post"
        INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
        INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
        LEFT JOIN "post_label" "post_label" ON "post_label"."postId" = "post"."id"
        LEFT JOIN "label" "label" ON "label"."id" = "post_label"."labelId"
      WHERE
        "post"."unread" = TRUE AND "inbox"."id" = ${inboxId}
      ORDER BY "post"."created_at" DESC
      LIMIT 500
    `;

    const rows = await this.postsRepository.query(SQL_ROWS);

    return { rows }
  }

  async findAllInbox(inbox: Partial<Inbox>, page: number, accountId: number): Promise<any> {
    const inboxId = inbox.id;

    // Find the total
    const SQL_COUNT = `
      SELECT
        COUNT(DISTINCT("post"."id")) as "total"
      FROM
      	"post" "post"
      	INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
      	INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
      WHERE
      	"post"."inboxId" = ${inboxId} AND "account"."id" = ${accountId}
    `

    // Find the records
    const SQL_ROWS = `
      SELECT
        "post"."id",
        "post"."title",
        "post"."status",
        "post"."updated_at",
        "inbox"."name",
        ARRAY_AGG("label"."text") as "labels",
        ARRAY_AGG("post_label"."id") as "post_labels",
        (SELECT COUNT(*) FROM comment WHERE "comment"."unread" = TRUE AND "comment"."postId" = "post"."id") as "unread",
        COUNT(DISTINCT("post"."id")) as "total"
      FROM
        "post" "post"
        INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
        INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
        LEFT JOIN "post_label" "post_label" ON "post_label"."postId" = "post"."id"
        LEFT JOIN "label" "label" ON "label"."id" = "post_label"."labelId"
      WHERE
        "post"."inboxId" = ${inboxId} AND "account"."id" = ${accountId}
      GROUP BY
        "post"."id",
        "inbox"."id"
      ORDER BY "post"."created_at" DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${page * PAGE_SIZE}
    `

    const rows = await this.postsRepository.query(SQL_ROWS);
    const count = await this.postsRepository.query(SQL_COUNT);
    const { total } = count[0]

    return { rows, total }
  }

  async findAllLabel(user: Partial<User>, label: ILabel, page: number, accountId: number, inboxId: number): Promise<any> {
    const SQL_COUNT = `
      SELECT
        COUNT(DISTINCT("post"."id")) as "total"
      FROM
        "post" "post"
        INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
        INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
        LEFT JOIN "post_label" "post_label" ON "post_label"."postId" = "post"."id"
        LEFT JOIN "label" "label" ON "label"."id" = "post_label"."labelId"
      WHERE
        "post_label"."labelId" = ${label.id} AND "inbox"."id" = ${inboxId}
    `

    // Find the records
    const SQL_ROWS = `
      SELECT
        "post"."id",
        "post"."title",
        "post"."status",
        "post"."updated_at",
        "inbox"."name" as "inbox",
        ARRAY_AGG("label"."text") as "labels",
        ARRAY_AGG("post_label"."id") as "post_labels",
        (SELECT COUNT(*) FROM comment WHERE "comment"."unread" = TRUE AND "comment"."postId" = "post"."id") as "unread",
        COUNT(DISTINCT("post"."id")) as "total"
      FROM
        "post" "post"
        INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
        INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
        LEFT JOIN "post_label" "post_label" ON "post_label"."postId" = "post"."id"
        LEFT JOIN "label" "label" ON "label"."id" = "post_label"."labelId"
      WHERE
        "post_label"."labelId" = ${label.id} AND "inbox"."id" = ${inboxId}
      GROUP BY
        "post"."id",
        "inbox"."id"
      ORDER BY "post"."created_at" DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${page * PAGE_SIZE}
    `;

    const rows = await this.postsRepository.query(SQL_ROWS);
    const count = await this.postsRepository.query(SQL_COUNT);
    const { total } = count[0]

    return { rows, total }
  }

  async findAllStatus(user: Partial<User>, status: string, page: number, accountId: number, inboxId: number): Promise<any> {
    const SQL_COUNT = `
      SELECT
        COUNT(DISTINCT("post"."id")) as "total"
      FROM
      	"post" "post"
      	INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
      	INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
      WHERE
      	"post"."status" = '${status}'::post_status_enum AND "inbox"."id" = ${inboxId}
    `

    // Find the records
    const SQL_ROWS = `
      SELECT
        "post"."id",
        "post"."title",
        "post"."status",
        "post"."updated_at",
        "inbox"."name" as "inbox",
        ARRAY_AGG("label"."text") as "labels",
        ARRAY_AGG("post_label"."id") as "post_labels",
        (SELECT COUNT(*) FROM comment WHERE "comment"."unread" = TRUE AND "comment"."postId" = "post"."id") as "unread",
        COUNT(DISTINCT("post"."id")) as "total"
      FROM
        "post" "post"
        INNER JOIN "inbox" "inbox" ON "inbox"."id" = "post"."inboxId"
        INNER JOIN "account" "account" ON "account"."id" = "inbox"."accountId"
        LEFT JOIN "post_label" "post_label" ON "post_label"."postId" = "post"."id"
        LEFT JOIN "label" "label" ON "label"."id" = "post_label"."labelId"
      WHERE
        "post"."status" = '${status}'::post_status_enum AND "inbox"."id" = ${inboxId}
      GROUP BY
        "post"."id",
        "inbox"."id"
      ORDER BY "post"."created_at" DESC
      LIMIT ${PAGE_SIZE}
      OFFSET ${page * PAGE_SIZE}
    `;

    const rows = await this.postsRepository.query(SQL_ROWS);
    const count = await this.postsRepository.query(SQL_COUNT);
    const { total } = count[0]

    return { rows, total }
  }

  async findOneWithMessageId(messageId: string): Promise<Post> {
    return await this.postsRepository.findOne({ where: { messageId } });
  }

  async findOne(id: string): Promise<Post> {
    return await this.postsRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.inbox", "inbox")
      .leftJoinAndSelect("post.postLabels", "postLabel")
      .leftJoinAndSelect("postLabel.label", "label")
      .leftJoinAndSelect("post.comments", "comments")
      .where("post.id = :id", { id })
      .orderBy({
        "comments.created_at": { order: "DESC", nulls: "NULLS LAST" },
        "post.id": "DESC",
      })
      .getOne();
  }

  async create(post: IPost): Promise<Post> {
    return await this.postsRepository.save(post);
  }

  async update(post: Partial<Post>): Promise<UpdateResult> {
    return await this.postsRepository.update(post.id, post);
  }
}
