import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AUTH_COOKIE, PAGE_SIZE, ERRORS, ACCOUNTID_COOKIE } from '../constants';
import { CookieService } from '../cookie.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [AuthService, CookieService],
})
export class AuthComponent implements OnInit {
  view:string = "login"
  error: string;
  notification: string;
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  name: string = "";
  resetToken: string = "";

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.cookieService.getCookie(AUTH_COOKIE)) {
      console.log(this.cookieService.getCookie(AUTH_COOKIE))
      this.router.navigate(['/admin']);
    }
  }

  navigate(view: string) {
    this.view = view;
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.name = "";
    this.resetToken = "";
    this.error = null;
    this.notification = null;
  }

  login() {
    this.error = null;
    this.notification = null;

    if (this.email == "") return this.error = "Please enter a valid email";
    if (this.password == "") return this.error = "Please enter a password";

    this.authService
    .login(this.email, this.password)
    .subscribe((res: any) => {
      const { token: { access_token }, accounts } = res;
      const accountId = accounts[0].id;

      this.cookieService.setCookie(AUTH_COOKIE, access_token);
      this.cookieService.setCookie(ACCOUNTID_COOKIE, accountId);

      this.router.navigate(['/admin']);
    }, (err) => {
      this.error = ERRORS.GENERIC;
    });
  }

  signup() {
    this.error = null;
    this.notification = null;

    if (this.email == "") return this.error = "Please enter a valid email";
    if (this.name == "") return this.error = "Please enter your name";
    if (this.password == "") return this.error = "Please enter a password";
    if (this.confirmPassword == "") return this.error = "Please enter a confirmation password";
    if (this.password != this.confirmPassword) return this.error = "Passwords need to match";

    this.authService
    .signup(this.email, this.name, this.password)
    .subscribe((res: any) => {
      this.notification = "Successfully created!";
      this.view = "login";
    }, (err) => {
      this.error = ERRORS.GENERIC;
    });
  }

  reset() {
    this.error = null;
    this.notification = null;

    if (this.email == "") return this.error = "Please enter a valid email";

    this.authService
    .reset(this.email)
    .subscribe((res: any) => {
      this.notification = "We've emailed you a code!";
      this.view = "update";
    }, (err) => {
      this.error = ERRORS.GENERIC;
    });
  }

  update() {
    this.error = null;
    this.notification = null;

    if (this.email == "") return this.error = "Please enter a valid email";
    if (this.resetToken == "") return this.error = "Please enter a reset token";
    if (this.password == "") return this.error = "Please enter a password";
    if (this.confirmPassword == "") return this.error = "Please enter a confirmation password";
    if (this.password != this.confirmPassword) return this.error = "Passwords need to match";

    this.authService
    .update(this.email, this.resetToken, this.password)
    .subscribe((res: any) => {
      this.notification = "Password updated!";
      this.view = "login";
    }, (err) => {
      this.error = ERRORS.GENERIC;
    });
  }

}
