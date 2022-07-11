import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CookieService } from '../cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AdminService } from './admin.service';
import {
  MARK_AS_READ,
  AUTH_COOKIE,
  CLOSE_POST_MODAL,
  CLOSE_INBOX_MODAL,
  STATUSES,
  ACCOUNTID_COOKIE,
  ADD_POSTS_POST_LABEL,
  DELETE_POSTS_POST_LABEL,
  UPDATE_POSTS_POST_STATUS,
  NEW_POST,
  NEW_COMMENT,
  YACK_SYSTEM,
} from '../constants';
import * as moment from 'moment';
import { ILabel } from '../../types/ILabel';
import { IInbox } from '../../types/IInbox';
import { IStatus } from '../../types/IStatus';
import { INBOX_CREATE, INBOX_DELETE, INBOX_UPDATE } from '../constants';
import { MessagesService } from './messages.service';
import { IPost } from 'src/types/IPost';
import { IPostLabel } from 'src/types/IPostLabel';
import { IEvent } from 'src/types/IEvent';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [AuthService, CookieService],
})
export class AdminComponent implements OnInit {

  error: string;
  notification: string;
  totalPosts: number = 0;
  allPosts: any[] = [];
  postModal: boolean = false;
  postId: number = 0;
  inboxModal: boolean = false;
  inboxId: number = 0;
  page: number = 0;
  token: string;
  accountId: number;
  currentInbox: IInbox;
  currentLabel: ILabel;
  currentStatus: IStatus;
  title = '';
  labels: ILabel[] = [];
  inboxes: IInbox[] = [];
  statuses: IStatus[] = STATUSES;
  unread: any[] = [];
  newLabelText: string;
  labelDeleteIconsVisible: boolean = false;
  newLabelModalVisible: boolean = false;
  inboxPopup: boolean = false;
  newInboxName: string = "";
  showNewInbox: boolean = false;
  @ViewChild('inboxName') inboxName: ElementRef;
  @ViewChild('inboxPopupContainer') inboxPopupContainer: ElementRef;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private cookieService: CookieService,
    private router: Router,
    private messagesService: MessagesService,
  ) { }

  captureKeysPressed(e: KeyboardEvent) {
    if (e.code.toUpperCase() == "ENTER") this.createNewInbox();
  }

  createNewInbox() {
    const { accountId, newInboxName, token } = this;

    this.adminService.createInbox(accountId, newInboxName, token).subscribe((res: any) => {
      this.getInboxes();
      this.newInboxName = "";
    }, (error) => {
      if (error.status) {
        this.error = "Slug is already taken";
      } else {
        this.error = "There has been an error creating your inbox";
      }
    })
  }

  toggleShowNewInbox() {
    if (this.showNewInbox) {
      this.showNewInbox = false;
      this.newInboxName = "";
    } else {
      this.showNewInbox = true;
      setTimeout(() => {
        this.inboxName.nativeElement.focus();
      }, 500);
    }
  }

  openInboxPopup() {
    this.inboxPopup = true;
  }

  closeInboxPopup() {
    this.inboxPopup = false;
  }

  get posts() {
    return this.allPosts
  }

  logout() {
    this.cookieService.deleteCookie(AUTH_COOKIE);
    this.router.navigate(['/auth']);
  }

  getBackgroundColorForStatusName(statusName) {
    return this.statuses.filter(status => status.name == statusName)[0].color
  }

  loadMore() {
    if (this.currentInbox) {
      this.openInbox(this.currentInbox, false);
    } else if (this.currentLabel) {
      this.getPostsByLabel(this.currentLabel, false);
    } else if (this.currentStatus) {
      this.getPostsByStatus(this.currentStatus, false);
    }
  }

  openInboxModal(id: number) {
    this.inboxId = id;
    this.inboxModal = true;
  }

  openPostModal(id: number) {
    this.postId = id;
    this.postModal = true;
  }

  resetPageAndPosts() {
    this.allPosts = [];
    this.page = 0;
  }

  getInboxes() {
    const { accountId, token } = this;

    this.adminService.getInboxes(accountId, token).subscribe((inboxes: IInbox[]) => {
      this.inboxes = inboxes.sort((a: any, b: any) => a.id - b.id);
      // console.log(this.inboxes)
      // this.openInbox(this.inboxes[0], false)
    }, (error) => {
      console.log(error)
    })
  }

  getLabels() {
    const { accountId, token, currentInbox } = this;
    const inboxId = currentInbox.id

    this.adminService.getLabels(inboxId, token).subscribe((labels: ILabel[]) => {
      this.labels = labels;
    }, (error) => {
      console.log(error)
    })
  }

  getUnreadPosts() {
    const { accountId, token, currentInbox } = this;
    const inboxId = currentInbox.id

    this.adminService.getUnreadPosts(token, inboxId).subscribe((res: any) => {
      this.unread = res.rows
    }, (error) => {
      console.log(error)
    })
  }

  hasUnreadPostsForLabel(labelId: number): boolean {
    return this.unread.filter((post: any) => post.labelId == labelId).length != 0;
  }

  hasUnreadPostsForStatus(status: string): boolean {
    return this.unread.filter((post: any) => post.status == status).length != 0;
  }

  isPostUnread(postId: number): boolean {
    return this.unread.filter((post: any) => post.id == postId).length != 0;
  }

  hasUnreadPostsForInbox(): boolean {
    if (!this.currentInbox) return
    return this.unread.filter((post: any) => post.inboxId == this.currentInbox.id).length != 0;
  }

  formatDate(date: string): string {
    // return moment(date).format('YYYY-MM-DD HH:mm:ss')
    return moment(date).fromNow()
  }

  getPostsByLabel(label: ILabel, resetPage: boolean) {
    if (resetPage) this.resetPageAndPosts();

    const { page, accountId, inboxId, token } = this;

    this.currentStatus = null;
    this.currentLabel = label;
    this.title = label.text;
    this.adminService.getPostsByLabel(token, label, page, accountId, inboxId).subscribe((res: any) => {
      const { rows, total } = res

      this.page = this.page + 1;
      this.totalPosts = total;
      this.allPosts = [
        ...this.allPosts,
        ...rows.map((row: any) => {
          return {
            ...row,
            labels: row.labels.filter((l) => !!l),
            post_labels: row.labels.filter((pl) => !!pl),
            updated_at: this.formatDate(row.updated_at),
          }
        })
      ];
    }, (error) => {
      console.log(error)
    })
  }

  getPostsByStatus(status: IStatus, resetPage: boolean) {
    if (resetPage) this.resetPageAndPosts();

    const { page, accountId, inboxId, token } = this;

    this.currentLabel = null;
    this.currentStatus = status;
    this.title = status.name;
    this.adminService.getPostsByStatus(token, status.name, page, accountId, inboxId).subscribe((res: any) => {
      const { rows, total } = res

      this.page = this.page + 1;
      this.totalPosts = total;
      this.allPosts = [...this.allPosts, ...rows.map((row: any) => {
        return {
          ...row,
          labels: row.labels.filter((l) => !!l),
          post_labels: row.labels.filter((pl) => !!pl),
          updated_at: this.formatDate(row.updated_at),
        }
      })];
    }, (error) => {
      console.log(error)
    })
  }

  openInbox(inbox: IInbox, resetPage: boolean) {
    if (resetPage) this.resetPageAndPosts();

    const { page, accountId, token } = this;
    const inboxId = inbox.id

    this.labels = []
    this.currentStatus = null;
    this.currentLabel = null;
    this.currentInbox = inbox;
    this.title = inbox.name;
    this.adminService.getPostsByInbox(token, inboxId, page, accountId).subscribe((res: any) => {
      const { rows, total } = res

      this.inboxId = inbox.id
      this.page = this.page + 1;
      this.totalPosts = total;
      this.allPosts = [...this.allPosts, ...rows.map((row: any) => {
        return {
          ...row,
          labels: row.labels.filter((l) => !!l),
          post_labels: row.labels.filter((pl) => !!pl),
          updated_at: this.formatDate(row.updated_at),
        }
      })];

      this.closeInboxPopup();
    }, (error) => {
      console.log(error)
    })

    /*
    this.adminService.getInbox(accountId, inboxId, token).subscribe((inbox: any) => {
    }, (err: any) => {
      this.error = "Could not get inbox";
    });
    */
    // Fetch labels & unread posts
    this.getLabels();
    this.getUnreadPosts();
  }

  removePostFromUnreadList(postId: number) {
    this.unread = this.unread.filter((post: any) => post.id != postId)
  }

  updatePostStatus(post: IPost) {
    // Then we need to remove it
    if (this.currentStatus) {
      this.allPosts = this.allPosts.filter((p: any) => p.id != post.id);
      this.totalPosts = this.totalPosts - 1;
    }

    // We juse need to update it
    if (!this.currentStatus) {
      this.allPosts = this.allPosts.map((p: any) => {
        if (p.id != post.id) return p

        // Update if it's the one
        return {
          ...p,
          status: post.status.name,
        }
      });
    }
  }

  addPostLabel(postId: number, postLabel: IPostLabel) {
    this.allPosts = this.allPosts.map((post: any) => {
      if (postId != post.id) return post;

      return {
        ...post,
        labels: [...post.labels, postLabel.label.text],
        post_labels: [...post.post_labels, postLabel.id],
      }
    })
  }

  deletePostLabel(postId: number, postLabelId: number, labelText: string) {
    this.allPosts = this.allPosts.map((post: any) => {
      if (postId != post.id) return post;

      return {
        ...post,
        labels: post.labels.filter((label: string) => label != labelText),
        post_labels: post.post_labels.filter((postLabel: number) => postLabel != postLabelId),
      }
    })
  }

  showLabelDeleteIcons() {
    this.labelDeleteIconsVisible = true;
  }

  hideLabelDeleteIcons() {
    this.labelDeleteIconsVisible = false;
  }

  showNewLabelModal() {
    this.newLabelModalVisible = true;
  }

  hideNewLabelModal() {
    this.newLabelModalVisible = false;
  }

  createNewLabel() {
    const { token, newLabelText, inboxId } = this;

    this.adminService.createLabel(inboxId, newLabelText, token).subscribe((res: any) => {
      const { text, id } = res;
      const label: ILabel = <ILabel>{
        id,
        text,
      }

      this.hideNewLabelModal();
      this.newLabelText = "";
      this.labels = [...this.labels, label];
    }, (error) => {
      this.error = "Error adding label";
    })
  }

  deleteLabel(event: MouseEvent, labelId: number) {
    if (!confirm("Are you sure? This cannot be undone!")) return

    event.preventDefault();

    const { token, inboxId } = this;

    this.adminService.deleteLabel(inboxId, labelId, token).subscribe((res: any) => {
      this.labels = this.labels.filter((label: ILabel) => label.id != labelId);
      this.hideLabelDeleteIcons();

      // If this is current label - then reset stuff
      if (this.currentLabel) {
        if (this.currentLabel.id == labelId) {
          this.currentLabel = null;
          this.resetPageAndPosts();
        }
      }
    }, (error) => {
      this.error = "Error deleting label";
    })
  }

  addPostToUnread(post: any) {
    this.unread = [...this.unread, post]
  }

  addPostToAllPosts(post: any) {
    this.allPosts = [...this.allPosts, post];
    this.totalPosts = this.totalPosts + 1;
  }

  ngOnInit(): void {
    // Close the inbox modal if it's a click outside
    document.addEventListener('click', (event: MouseEvent) => {
      if (this.inboxPopupContainer && !this.inboxPopupContainer.nativeElement.contains(event.target)) {
        this.closeInboxPopup()
      }
    }, true)

    // Now listen for messages
    // These are internal events - not websocket messages
    this.adminService.message$.subscribe(({ type, payload }) => {
      switch (type) {
        case ADD_POSTS_POST_LABEL:
          this.addPostLabel(payload.postId, payload.postLabel);
          break;
        case DELETE_POSTS_POST_LABEL:
          this.deletePostLabel(payload.postId, payload.postLabelId, payload.labelText);
          break;
        case UPDATE_POSTS_POST_STATUS:
          this.updatePostStatus(payload);
          break;
        case MARK_AS_READ:
          this.removePostFromUnreadList(Number(payload));
          break;
        case INBOX_UPDATE:
          this.getInboxes();
          break;
        case INBOX_DELETE:
          this.getInboxes();
          this.resetPageAndPosts();
          break;
        case CLOSE_INBOX_MODAL:
          this.inboxModal = false;
          break;
        case CLOSE_POST_MODAL:
          this.postModal = false;
          break;
      }
    })

    if (this.cookieService.getCookie(AUTH_COOKIE)) {
      const token: string = this.cookieService.getCookie(AUTH_COOKIE);
      const accountId: number = Number(this.cookieService.getCookie(ACCOUNTID_COOKIE));
      const expiry: any = this.authService.parseJwt(token).exp;
      const expiryDate: any = moment(new Date(expiry * 1000));
      const hasExpired: boolean = moment(new Date()).isAfter(expiryDate);

      // Save this for other calls
      this.token = token;
      this.accountId = accountId;

      if (hasExpired) {
        this.cookieService.deleteCookie(AUTH_COOKIE);
        this.router.navigate(['/auth']);
      } else {
        this.getInboxes();
      }
    } else {
      this.router.navigate(['/auth']);
    }

    // Set up the messaging stuff
    // This is the websocket broker
    const websocketDestination: string = "account" + this.accountId;
    this.initMessageHandler(websocketDestination);

    // Debug
    // this.openPostModal(1);
    // this.openInboxModal(1);
  }

  initMessageHandler(websocketDestination: string) {
    this.messagesService.receiveMessage(websocketDestination).subscribe((message: IEvent) => {
      const { type, payload, destination } = message;

      // Debug
      console.log(message)

      // Catch any unwanted messages
      if (websocketDestination != destination) return

      // Not process incoming websocket messags
      switch (type) {
        case NEW_POST:
          // This is POST sepcific
          // These wont be available on NEW_COMMENTS
          const { status, inbox, labels, post_labels, updated_at } = payload;

          // This we need to add manually
          // Because when we create the post it doesn't contain any
          const post: any = {
            ...payload,
            labels,
            post_labels,
            inbox: inbox.name,
            updated_at: this.formatDate(updated_at),
          }

          // If the post is part of the current status
          if (this.currentStatus) {
            if (this.currentStatus.name.toUpperCase() == status.toUpperCase()) this.addPostToAllPosts(post)
          }

          // If they are viewing the current inbox
          if (this.currentInbox) {
            if (this.currentInbox.id == inbox.id) this.addPostToAllPosts(post)
          }

          // Add this to the unread, because it's new
          this.addPostToUnread(post)
          break;

        case NEW_COMMENT:
          // Send this to the modal
          this.adminService.send({ type: NEW_COMMENT, payload })

          // Update the dashboard unread list
          this.addPostToUnread(payload.post);
          break;
      }
    });

    // Listen for any system messages
    this.messagesService.receiveMessage(YACK_SYSTEM).subscribe((message: any) => console.log(YACK_SYSTEM, message));

    // Ping!
    setTimeout(() => this.messagesService.sendMessage(YACK_SYSTEM, "👋🏻"), 2000)
  }
}
