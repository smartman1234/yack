import { Account } from '../accounts/account.entity';

export interface IInbox {
  id?: number,
  name: string,
  description?: string,
  image?: string,
  website?: string,
  slug?: string,
  account?: Partial<Account>,
}
