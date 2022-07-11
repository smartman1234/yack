import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  constructor() {
  }

  setCookie(name: string, val: string) {

      const date: Date = new Date();
      const value: string = val;

      // Set it expire in 7 days
      date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

      // Set it
      document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
  }

  getCookie(name: string): string {

      const value: string = "; " + document.cookie;
      const parts: Array<String> = value.split("; " + name + "=");

      if (parts.length == 2) {
          return parts.pop().split(";").shift();
      }
  }

  deleteCookie(name: string) {

      const date: Date = new Date();

      // Set it expire in -1 days
      date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

      // Set it
      document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
  }
}
