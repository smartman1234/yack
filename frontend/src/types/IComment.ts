export interface IComment {
  id?: number,
  text: string,
  html: string,
  name?: string,
  email?: string,
  attachments?: string,
  description?: string,
  unread: boolean,
  messageId: string,
  created_at: any,
}
