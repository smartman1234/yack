import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../cookie.service';
import { API_PATH } from '../constants';
import { ILabel } from '../../types/ILabel';
import { IPost } from 'src/types/IPost';
import { IPostLabel } from 'src/types/IPostLabel';

// Default & authless
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdminService {
  public message$: EventEmitter<any>;

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {
    this.message$ = new EventEmitter();
  }

  public send(payload: any): void {
    this.message$.emit(payload);
  }

  parseJwt(token: string): any {
    if (!token) return {}

    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  }

  getLabels(
    inboxId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/labels/${inboxId}`, httpOptionsWithToken);
  }

  // Posts

  getPostsByInbox(
    token: string,
    inboxId: number,
    page: number,
    accountId: number,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/posts/${accountId}/inbox/${inboxId}?page=${page}`, httpOptionsWithToken);
  }

  getPostsByLabel(
    token: string,
    label: ILabel,
    page: number,
    accountId: number,
    inboxId: number,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/posts/${accountId}/inbox/${inboxId}/label/${label.id}/${label.text}?page=${page}`, httpOptionsWithToken);
  }

  getPostsByStatus(
    token: string,
    status: string,
    page: number,
    accountId: number,
    inboxId: number,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/posts/${accountId}/inbox/${inboxId}/status/${status}?page=${page}`, httpOptionsWithToken);
  }

  getUnreadPosts(
    token: string,
    inboxId: number,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/posts/${inboxId}/unread`, httpOptionsWithToken);
  }

  getPost(postId: number, token: string): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/posts/${postId}`, httpOptionsWithToken);

  }

  updatePost(
    post: IPost,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    return this.http.put(`${API_PATH}/posts/${post.id}`, { post }, httpOptionsWithToken);
  }

  deletePostLabel(
    postLabelId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    return this.http.delete(`${API_PATH}/post-labels/${postLabelId}`, httpOptionsWithToken);
  }

  addPostLabel(
    label: ILabel,
    post: IPost,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    return this.http.post(`${API_PATH}/post-labels`, { label, post }, httpOptionsWithToken);
  }

  createComment(
    text: string,
    post: IPost,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    return this.http.post(`${API_PATH}/comments`, { text, post }, httpOptionsWithToken);
  }

  // Inboxes

  getInboxes(
    accountId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/inboxes/account/${accountId}`, httpOptionsWithToken);
  }

  getInbox(
    accountId: number,
    id: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/inboxes/account/${accountId}/inbox/${id}`, httpOptionsWithToken);
  }

  getCheckout(
    slug: string,
    priceId: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.post(`${API_PATH}/webhook/subscription/create_session`, { slug, priceId }, httpOptionsWithToken);
  }

  getCustomerPortal(
    accountId: number,
    id: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(`${API_PATH}/inboxes/account/${accountId}/inbox/${id}/customer_portal`, httpOptionsWithToken);
  }

  createInbox(
    accountId: number,
    name: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    return this.http.post(`${API_PATH}/inboxes/account/${accountId}/inbox`, { name }, httpOptionsWithToken);
  }

  updateInbox(
    accountId: number,
    id: number,
    name: string,
    image: string,
    description: string,
    website: string,
    slug: string,
    widget: any,
    form: any,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.put(`${API_PATH}/inboxes/account/${accountId}/inbox/${id}`, {
      name,
      image,
      description,
      website,
      widget,
      form,
      slug,
    }, httpOptionsWithToken);
  }

  deleteInbox(
    accountId: number,
    id: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.delete(`${API_PATH}/inboxes/account/${accountId}/inbox/${id}`, httpOptionsWithToken);
  }

  // Labels

  deleteLabel(
    inboxId: number,
    labelId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.delete(`${API_PATH}/labels/inbox/${inboxId}/label/${labelId}`, httpOptionsWithToken);
  }

  createLabel(
    inboxId: number,
    text: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.post(`${API_PATH}/labels/inbox/${inboxId}/label`, {
      text
    }, httpOptionsWithToken);
  }

  // Old functions from PDFasaurus
  // ---------------------------

  getRequests(
    token: string,
    page: number,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(API_PATH + '/requests?page=' + page, httpOptionsWithToken);
  }

  getSubscription(
    userId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(API_PATH + '/users/' + userId + '', httpOptionsWithToken);
  }

  cancelSubscription(
    userId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.put(API_PATH + '/users/' + userId + '/cancel_subscription', {}, httpOptionsWithToken);
  }

  updateSubscription(
    userId: number,
    plan: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.put(API_PATH + '/users/' + userId + '/update_subscription', { plan }, httpOptionsWithToken);
  }

  getApiKey(
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(API_PATH + '/key', httpOptionsWithToken);
  }

  getNewApiKey(
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(API_PATH + '/key/new', httpOptionsWithToken);
  }

  updateTemplate(
    templateId: number,
    content: string,
    name: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.put(API_PATH + '/templates/' + templateId, {
      content,
      name,
      deleted: false,
    }, httpOptionsWithToken);
  }

  deleteTemplate(
    templateId: number,
    content: string,
    name: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.put(API_PATH + '/templates/' + templateId, {
      content,
      name,
      deleted: true,
    }, httpOptionsWithToken);
  }

  getTemplate(
    templateId: number,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(API_PATH + '/templates/' + templateId, httpOptionsWithToken);
  }

  getTemplates(
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.get(API_PATH + '/templates', httpOptionsWithToken);
  }

  createTemplate(
    name: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.post(API_PATH + '/templates', {
      name
    }, httpOptionsWithToken);
  }

  preview(
    templateId: number,
    templateValues: string,
    token: string,
  ): any {
    const httpOptionsWithToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }),
    };

    // ID or SLUG can be null here
    return this.http.post(API_PATH + '/templates/preview', {
      templateId,
      templateValues: JSON.parse(templateValues),
    }, httpOptionsWithToken);
  }
}
