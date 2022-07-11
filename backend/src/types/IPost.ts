import { Inbox } from '../inboxes/inbox.entity';
import { PostLabel } from '../post-labels/post-label.entity';

export interface IPost {
  id?: number,
  status: string,
  title: string,
  description: string,
  html: string,
  text: string,
  attachments?: string,
  fields?: string,
  browser?: string,
  agent?: string,
  ip?: string,
  name: string,
  email: string,
  messageId?: string,
  latestMessageId?: string,
  unread?: boolean,
  inbox?: Partial<Inbox>,
  postLabels?: PostLabel[],
}
