import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Post } from '../posts/post.entity';
import { Label } from '../labels/label.entity';

@Entity()
export class PostLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Post, post => post.postLabels, { cascade: true })
  post: Post

  @ManyToOne(type => Label, label => label.postLabels, { cascade: true })
  label: Label

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
