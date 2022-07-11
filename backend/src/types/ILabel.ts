import { Inbox } from '../inboxes/inbox.entity';

export interface ILabel {
  id?: number,
  text: string,
  inbox?: Partial<Inbox>,
}
