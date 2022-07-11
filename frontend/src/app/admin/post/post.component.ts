import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../admin.service';
import { CookieService } from '../../cookie.service';
import {
  MARK_AS_READ,
  AUTH_COOKIE,
  CLOSE_POST_MODAL,
  STATUSES,
  ADD_POSTS_POST_LABEL,
  DELETE_POSTS_POST_LABEL,
  UPDATE_POSTS_POST_STATUS,
  NEW_COMMENT,
} from '../../constants';
import * as moment from 'moment';
import { ILabel } from '../../../types/ILabel';
import { IInbox } from '../../../types/IInbox';
import { IStatus } from '../../../types/IStatus';
import { IPostLabel } from 'src/types/IPostLabel';
import { IPost } from 'src/types/IPost';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IComment } from 'src/types/IComment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input('postId') postId: number;
  @Input('accountId') accountId: number;
  @Input('labels') labels: ILabel[];

  @ViewChild('selectstatus') selectStatus: ElementRef;
  @ViewChild('labelstatus') labelStatus: ElementRef;

  statuses: IStatus[] = STATUSES;
  notification: string;
  error: string;
  token: string;
  post: IPost;
  compose: string;
  showAttachments: boolean = false;
  showFields: boolean = false;
  showMeta: boolean = false;
  accountLabelsMenu: boolean = false;
  loadingCompose: boolean = false;
  attachments: any[] = [];
  fields: any[] = [];

  constructor(
    private adminService: AdminService,
    private cookieService: CookieService,
  ) { }

  toggleAttachments() {
    this.showAttachments = !this.showAttachments;
  }

  toggleMeta() {
    this.showMeta = !this.showMeta;
  }

  toggleFields() {
    this.showFields = !this.showFields;
  }

  reply() {
    const { compose, post, token } = this;

    this.loadingCompose = true;
    this.adminService.createComment(compose, post, token).subscribe((res: any) => {
      const {
        created_at,
        id,
        messageId,
        text,
        unread
      } = res;
      const comment: IComment = <IComment>{
        created_at: moment(created_at).fromNow(),
        id,
        messageId,
        text,
        html: "<p>" + text + "</p>",
        description: text,
        unread
      }

      // Update the existing post
      this.post = <IPost>{
        ...this.post,
        comments: [comment, ...this.post.comments],
      };

      // Reset this
      this.loadingCompose = false;
      this.compose = "";
    }, (error) => {
      this.loadingCompose = false;
      this.error = "Error updating post";
    })
  }

  captureKeysPressed(e: KeyboardEvent) {
    if (e.code.toUpperCase() == "ENTER") this.reply();
  }

  addComment(comment: any) {
    const newComment = {
      ...comment,
      attachments: comment.attachments ? JSON.parse(comment.attachments) : [],
      created_at: moment(comment.created_at).fromNow()
    }

    this.post = {
      ...this.post,
      comments: [newComment, ...this.post.comments]
    };
  }

  ngOnInit(): void {
    this.token = this.cookieService.getCookie(AUTH_COOKIE);
    this.getPost();

    // Now listen for messages
    this.adminService.message$.subscribe(({ type, payload }) => {
      console.log({ type, payload });

      switch (type) {
        case NEW_COMMENT:
          if (payload.post.id == this.post.id) {
            this.addComment(payload);
            this.markAsRead();
          }
          break;
      }
    })
  }

  getPost() {
    const { postId, token } = this;

    this.adminService.getPost(postId, token).subscribe((post: any) => {
      const {
        created_at,
        description,
        text,
        email,
        messageId,
        name,
        status,
        unread,
        title,
        inbox,
        agent,
        browser,
        attachments,
        postLabels,
        id,
        fields,
        comments,
      } = post;

      if (attachments) this.attachments = JSON.parse(attachments)
      if (fields) this.fields = JSON.parse(fields).fields.map(field => {
        const label = field[0]
        const value = field[1]

        return { label, value }
      })

      this.post = <IPost>{
        id,
        description,
        text,
        email,
        messageId,
        name,
        unread,
        agent,
        browser,
        title,
        comments: comments.map((comment: any) => {
          return {
            ...comment,
            attachments: comment.attachments ? JSON.parse(comment.attachments) : [],
            created_at: moment(comment.created_at).fromNow()
          }
        }),
        inbox: <IInbox>inbox,
        postLabels: <IPostLabel[]>postLabels,
        status: <IStatus>{
          name: status,
          color: this.statuses.filter((s: IStatus) => s.name == status)[0].color,
        },
        created_at: moment(created_at).format('YYYY-MM-DD HH:mm:ss'),
      };

      // Now mark it as read
      this.markAsRead();
    }, (error) => {
      this.error = "There has been an error";
    })
  }

  close() {
    this.adminService.send({ type: CLOSE_POST_MODAL });
  }

  selectStatusUpdate(event: any) {
    const selectBox: HTMLSelectElement = <HTMLSelectElement> this.selectStatus.nativeElement;
    const selectBoxValue: string = selectBox.value.split(' ')[1];
    const status: IStatus = this.statuses.filter((s: IStatus) => s.name == selectBoxValue)[0];

    // Status eeds to be treated as immutable
    // Otherwise the color doens't get set
    this.post = <IPost>{
      ...this.post,
      status: <IStatus>{
        name: status.name,
        color: status.color,
      }
    };

    // Update the post
    this.updatePostStatus();
  }

  modalClick(event: any) {
    if (event.target.id == "ignoreClickBlur") return;
    this.accountLabelsMenu = false;
  }

  dismissAccountLabelsMenu() {
    this.accountLabelsMenu = !this.accountLabelsMenu;
    this.resetNotices();
  }

  resetNotices() {
    this.notification = null;
    this.error = null;
  }

  addPostLabel(label: ILabel) {
    const { token, post } = this;
    let postWithoutStatus = { ...post };

    delete postWithoutStatus.status;

    if (this.post.postLabels.filter(postLabel => postLabel.label.id == label.id).length != 0) {
      return this.error = "You already have this label"
    }

    this.resetNotices();
    this.adminService.addPostLabel(label, postWithoutStatus, token).subscribe((res: any) => {
      const { id } = res;

      // Create a new post label
      const postLabel: IPostLabel = <IPostLabel>{
        id,
        post: res.post,
        label: res.label,
      };

      // Update the existing post
      this.post = <IPost>{
        ...this.post,
        postLabels: [...this.post.postLabels, postLabel],
      };

      // Communicate with the dashboard
      this.adminService.send({
        type: ADD_POSTS_POST_LABEL,
        payload: {
          postId: this.post.id,
          postLabel,
        }
      })
    }, (error) => {
      this.error = "Error adding label";
    });
  }

  deletePostLabel(postLabelId: number, labelText: string) {
    const { token } = this;

    this.resetNotices();
    this.adminService.deletePostLabel(postLabelId, token).subscribe((res: any) => {
      this.post = <IPost>{
        ...this.post,
        postLabels: this.post.postLabels.filter((postLabel: IPostLabel) => postLabelId != postLabel.id),
      };

      // Communicate with the dashboard
      this.adminService.send({
        type: DELETE_POSTS_POST_LABEL,
        payload: {
          postId: this.post.id,
          postLabelId,
          labelText,
        }
      })
    }, (error) => {
      this.error = "Error deleting label";
    });
  }

  updatePostStatus() {
    const { post, token } = this;

    this.resetNotices();
    this.adminService.updatePost(post, token).subscribe((res: any) => {
      // Communicate with the dashboard
      this.adminService.send({
        type: UPDATE_POSTS_POST_STATUS,
        payload: post,
      });
    }, (error) => {
      this.error = "Error updating post";
    })
  }

  markAsRead() {
    const { post, token } = this;
    const unreadPost: IPost = <IPost>{
      ...this.post,
      unread: false,
    };

    this.resetNotices();
    this.post = unreadPost;
    this.adminService.updatePost(unreadPost, token).subscribe((res: any) => {
      this.adminService.send({ type: MARK_AS_READ, payload: post.id });
    }, (error) => {
      this.error = "Error marking as read";
    })
  }
}
