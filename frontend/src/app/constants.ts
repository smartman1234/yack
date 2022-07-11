import { IStatus } from '../types/IStatus';
import { environment } from '../environments/environment';

export const WIDGET_VERSION: string = "0.1.0"; // this needs to come from the widget package.json
export const ACCOUNTID_COOKIE: string = environment.ACCOUNTID_COOKIE;
export const AUTH_COOKIE: string = environment.AUTH_COOKIE;
export const API_PATH: string = environment.API_PATH;
export const PAGE_SIZE: number = 20;
export const ERRORS: any = {
  GENERIC: 'Something has gone wrong',
}
export const STATUSES: IStatus[] = [
  <IStatus> { name: 'OPEN', color: '#ffc168' },
  <IStatus> { name: 'FLAGGED', color: '#ff6c5f' },
  <IStatus> { name: 'LATER', color: '#ff4f81' },
  <IStatus> { name: 'CLOSED', color: '#b84592' },
]
/* export const STATUSES: IStatus[] = [
  <IStatus> { name: 'OPEN', color: '#C54194' },
  <IStatus> { name: 'FLAGGED', color: '#DF406D' },
  <IStatus> { name: 'LATER', color: '#AC42B6' },
  <IStatus> { name: 'CLOSED', color: '#9743D9' },
] */
export const CLOSE_INBOX_MODAL: string = "CLOSE_INBOX_MODAL";
export const CLOSE_POST_MODAL: string = "CLOSE_POST_MODAL";
export const INBOX_DELETE: string = "INBOX_DELETE";
export const INBOX_CREATE: string = "INBOX_CREATE";
export const INBOX_UPDATE: string = "INBOX_UPDATE";
export const MARK_AS_READ: string = "MARK_AS_READ";
export const ADD_POSTS_POST_LABEL: string = "ADD_POSTS_POST_LABEL";
export const DELETE_POSTS_POST_LABEL: string = "DELETE_POSTS_POST_LABEL";
export const UPDATE_POSTS_POST_STATUS: string = "UPDATE_POSTS_POST_STATUS";
export const NEW_POST:string = "NEW_POST";
export const NEW_COMMENT:string = "NEW_COMMENT";
export const YACK_SYSTEM = "YACK_SYSTEM";
export const STRIPE:string = environment.STRIPE_KEY;
export const PRICE:string = environment.STRIPE_PRICE_ID;
