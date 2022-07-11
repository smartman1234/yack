import { Post } from '../posts/post.entity';

export interface IComment {
  id?: number,
  text: string,
  html: string,
  name?: string,
  email?: string,
  attachments?: string,
  description: string,
  unread: boolean,
  post: Partial<Post>,
  messageId?: string,
}
