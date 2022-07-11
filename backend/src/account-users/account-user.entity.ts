import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Post } from '../posts/post.entity';
import { Label } from '../labels/label.entity';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';

@Entity()
export class AccountUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Account, account => account.accountUsers)
  account: Account;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
