
export interface IInbox {
  id?: number,
  name: string,
  description: string,
  website: string,
  image: string,
  current_period_start?: Date,
  current_period_end?: Date,
  active?: boolean,
}
