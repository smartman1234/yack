import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Inbox } from '../inboxes/inbox.entity';
import { PostLabel } from '../post-labels/post-label.entity';

enum Status {
  Open = 'OPEN',
  Flagged = 'FLAGGED',
  Later = 'LATER',
  Closed = 'CLOSED',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Open
  })
  status: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  html: string;

  @Column({ nullable: true, type: 'text' })
  text: string;

  @Column({ nullable: true, type: 'text' })
  attachments: string;

  @Column({ nullable: true, type: 'text' })
  fields: any;

  @Column({ nullable: true, type: 'text' })
  browser: string;

  @Column({ nullable: true, type: 'text' })
  agent: string;

  @Column({ default: '' })
  ip: string;

  @Column({ default: '' })
  name: string;

  @Column()
  email: string;

  @Column({ default: '' })
  messageId: string;

  @Column({ default: null })
  latestMessageId: string;

  @Column({ type: "boolean", default: true })
  unread: boolean;

  @ManyToOne(type => Inbox, inbox => inbox.posts)
  inbox: Inbox;

  @OneToMany(type => Comment, comment => comment.post)
  comments: Comment[];

  @OneToMany(type => PostLabel, postLabel => postLabel.post)
  postLabels: PostLabel[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
