import { CreateDateColumn, UpdateDateColumn, Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Inbox } from '../inboxes/inbox.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  resetToken: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
