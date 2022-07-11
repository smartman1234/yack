import { IAccount } from './IAccount';
import { IComment } from './IComment';
import { IInbox } from './IInbox';
import { IPostLabel } from './IPostLabel';
import { IStatus } from './IStatus';

export interface IPost {
  id?: number,
  title: string,
  description: string,
  text?: string,
  email: string,
  messageId: string,
  name: string,
  created_at: any,
  unread: boolean,
  attachments?: string,
  browser?: string,
  agent?: string,
  fields: any,
  status: IStatus,
  postLabels: IPostLabel[],
  inbox?: IInbox,
  account?: IAccount,
  comments?: any,
}
