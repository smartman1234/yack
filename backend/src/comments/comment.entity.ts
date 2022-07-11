import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  text: string;

  @Column({ nullable: true, type: 'text' })
  attachments: string;

  @Column({ nullable: true, type: 'text' })
  html: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "boolean", default: true })
  unread: boolean;

  @Column({ nullable: true, default: '' })
  name: string;

  @Column({ nullable: true, default: '' })
  email: string;

  @Column({ default: '' })
  messageId: string;

  @ManyToOne(type => Post, post => post.comments)
  post: Post;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
