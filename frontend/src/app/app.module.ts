import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { WebsiteModule } from './website/website.module';
import { AuthModule } from './auth/auth.module';
import { CookieService } from './cookie.service';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    WebsiteModule,
    AuthModule,
    AdminModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbNavModule,
    FormsModule,
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
