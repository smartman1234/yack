import { ILabel } from './ILabel';
import { IPost } from './IPost';

export interface IPostLabel {
  id?: number,
  post: IPost,
  label: ILabel,
}
