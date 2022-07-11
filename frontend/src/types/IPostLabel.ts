import { ILabel } from './ILabel';
import { IPost } from './IPost';

export interface IPostLabel {
  id?: number,
  label: ILabel,
  post: IPost,
}
