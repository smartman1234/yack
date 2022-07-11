import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  view: string = "home";
  terms: boolean = false;
  privacy: boolean = false;

  constructor() { }

  ngOnInit(): void {}

  navigate(view: string) {
    this.view = view;
  }

  openTerms() {
    this.terms = true;
  }

  openPrivacy() {
    this.privacy = true;
  }

  close() {
    this.terms = false;
    this.privacy = false;
  }
}
