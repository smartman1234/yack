import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';

@Entity()
export class Inbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '', type: 'text' })
  website: string;

  @Column({ default: '', type: 'text' })
  image: string;

  @Column({ default: '{}', type: 'json' })
  widget: any;

  @Column({ default: '{}', type: 'json' })
  form: any;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  subscription: string;

  @Column({ nullable: true })
  customer: string;

  @Column({ nullable: true })
  current_period_start: Date;

  @Column({ nullable: true })
  current_period_end: Date;

  @Column({ nullable: true })
  active: boolean;

  @OneToMany(type => Post, post => post.inbox)
  posts: Post[];

  @ManyToOne(type => Account, account => account.inboxes)
  account: Account;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
