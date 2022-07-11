import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../admin.service';
import { CookieService } from 'src/app/cookie.service';
import { API_PATH, AUTH_COOKIE, PAGE_SIZE, ERRORS, CLOSE_POST_MODAL, CLOSE_INBOX_MODAL, STATUSES, ACCOUNTID_COOKIE } from '../../constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { STRIPE, PRICE, INBOX_CREATE, INBOX_DELETE, INBOX_UPDATE, WIDGET_VERSION } from '../../constants';
import * as moment from 'moment';
const { Stripe } = window;

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  @Input('inboxId') inboxId: number;
  @Input('accountId') accountId: number;

  SERVER_URL = API_PATH + "/upload";
  uploadForm: FormGroup;

  tab: number = 0;
  token: string;
  color: string;
  name: string = "";
  image: string = "";
  website: string = "";
  widget: any = { color: '#FFCA28' };
  form: any = { color: '#FFCA28' };
  version: string = WIDGET_VERSION;
  slug: string = "";
  description: string;
  notification: string;
  error: string;
  current_period_start: string;
  current_period_end: string;
  active: boolean;
  customer: string;
  newInbox: boolean;

  constructor(
    private adminService: AdminService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
  ) { }

  showTab(index: number) {
    this.tab = index;
  }

  openCheckout() {
    const stripe = Stripe(STRIPE);
    const { slug, token } = this;

    this.adminService.getCheckout(slug, PRICE, token).subscribe((res:any) => {
      const { sessionId } = res;

      // Send them tot he checout
      stripe
      .redirectToCheckout({ sessionId })
      .then((result) => {
        if (result.error) this.error = result.error.message;
      });
    }, (err: any) => {
      this.error = "Could not get inbox customer portal";
    });
  }

  async launchCustomerPortal() {
    const inboxId: number = Number(this.inboxId);
    const accountId: number = Number(this.accountId)
    const token: string = this.cookieService.getCookie(AUTH_COOKIE);

    this.adminService.getCustomerPortal(accountId, inboxId, token).subscribe((res:any) => {
      const {
        created,
        customer,
        id,
        livemode,
        object,
        return_url,
        url
      } = res

      // Redirect them
      window.location.href = url;
    }, (err: any) => {
      this.error = "Could not get inbox customer portal";
    });
  }

  delete() {
    const { inboxId, accountId, token } = this;

    this.notification = null;
    this.error = null;

    if (this.active) return this.error = "Please delete your subscription first";

    if (confirm('Are you sure? This cannot be undone')) {
      this.adminService.deleteInbox(accountId, inboxId, token).subscribe((res: any) => {
        this.close();
        this.adminService.send({ type: INBOX_DELETE });
      }, (error) => {
        this.error = "There has been an error"
      })
    }
  }

  close() {
    this.adminService.send({ type: CLOSE_INBOX_MODAL });
  }

  validateWebsite(cb: any) {
    if (!this.validURL(this.website)) return this.error = "Website is not the correct format";
    cb();
  }

  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  save() {
    this.notification = null;
    this.error = null;

    this.validateWebsite(() => {
      this.update();
    });
  }

  update() {
    const {
      inboxId,
      accountId,
      name,
      image,
      description,
      website,
      slug,
      widget,
      form,
      token,
    } = this;

    this.adminService.updateInbox(accountId, inboxId, name, image, description, website, slug, widget, form, token).subscribe((res: any) => {
      this.notification = "Successfully updated!";
      this.adminService.send({ type: INBOX_UPDATE });
    }, (error) => {
      if (error.status) {
        this.error = "Slug is already taken";
      } else {
        this.error = "There has been an error updating your inbox";
      }
    })
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('image').setValue(file);
      this.onSubmit()
    }
  }

  onSubmit() {
    const formData = new FormData();
    const file = this.uploadForm.get('image').value

    if (!file) return

    formData.append('file', file);

    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe((res) => {
      const { path } = res;
      this.image = `${API_PATH}/${path}`;
    }, (err) => {
      this.error = "We couldn't upload this file"
    });
  }

  changeComplete(e: any) {
    const { color: { hex } } = e;
    this.widget.color = hex;
  }

  ngOnInit(): void {
    const inboxId: number = Number(this.inboxId);
    const accountId: number = Number(this.accountId)
    const token: string = this.cookieService.getCookie(AUTH_COOKIE);

    this.newInbox = !!this.inboxId;
    this.uploadForm = this.formBuilder.group({
      image: ['']
    });

    // Save it
    this.token = token;

    // This is a new inbox then
    if (inboxId == 0) {
      this.name = "";
      this.image = "https://via.placeholder.com/150?text=NA";
      this.website = "";
      this.description = "";
      this.slug = "";
    } else {
      // Get the inbox detail
      this.adminService.getInbox(accountId, inboxId, token).subscribe(({
        name,
        image,
        website,
        description,
        slug,
        widget,
        form,
        active,
        current_period_start,
        current_period_end,
        customer,
      }) => {
        this.name = name;
        this.image = image || "https://via.placeholder.com/150?text=NA";
        this.website = website;
        this.slug = slug;
        this.description = description;
        this.widget = widget;
        this.form = form;
        this.active = active;
        this.customer = customer;
        this.current_period_start = moment(current_period_start).format("MM/DD/YYYY");
        this.current_period_end = moment(current_period_end).format("MM/DD/YYYY");

        // <color-circle /> throws an error
        // Set default widget color
        if (!this.widget.color) this.widget.color = "#ffc107";
      }, (err: any) => {
        this.error = "Could not get inbox";
      });
    }
  }
}
