import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../cookie.service';
import { API_PATH } from '../constants';

// Default & authless
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  parseJwt(token: string): any {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  }

  login(
    email: string,
    password: string,
  ): any {
    return this.http.post(API_PATH + '/auth/login', {
      email,
      password,
    }, httpOptions);
  }

  signup(
    email: string,
    name: string,
    password: string,
  ): any {
    return this.http.post(API_PATH + '/auth/signup', {
      email,
      name,
      password,
    }, httpOptions);
  }

  reset(
    email: string,
  ): any {
    return this.http.post(API_PATH + '/auth/reset', {
      email,
    }, httpOptions);
  }

  update(
    email: string,
    resetToken: string,
    password: string,
  ): any {
    return this.http.post(API_PATH + '/auth/update', {
      email,
      resetToken,
      password,
    }, httpOptions);
  }
}
