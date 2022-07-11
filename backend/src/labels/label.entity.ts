import { PostLabel } from '../post-labels/post-label.entity';
import { CreateDateColumn, UpdateDateColumn, Entity, Column, OneToOne, JoinTable, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Inbox } from '../inboxes/inbox.entity';
import { Account } from '../accounts/account.entity';

@Entity()
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  text: string;

  @ManyToOne(type => Inbox)
  @JoinTable()
  inbox: Inbox;

  @OneToMany(type => PostLabel, postLabel => postLabel.label)
  postLabels: PostLabel[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
