import { PostLabel } from '../post-labels/post-label.entity';
import { CreateDateColumn, UpdateDateColumn, Entity, Column, JoinTable, ManyToMany, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Inbox } from '../inboxes/inbox.entity';
import { User } from '../users/user.entity';
import { AccountUser } from '../account-users/account-user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @OneToMany(type => Inbox, inbox => inbox.account)
  inboxes: Inbox[];

  @OneToMany(type => AccountUser, accountUser => accountUser.account)
  accountUsers: AccountUser[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
