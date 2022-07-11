import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';
import { ChartsModule } from 'ng2-charts';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { InboxComponent } from './inbox/inbox.component';
import { PostComponent } from './post/post.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MessagesService } from './messages.service';
import { API_PATH } from '../constants';
import { ColorCircleModule } from 'ngx-color/circle';
import { NgxColorsModule } from 'ngx-colors';

const config: SocketIoConfig = {
  url: API_PATH,
  options: {}
};

@NgModule({
  declarations: [
    AdminComponent,
    InboxComponent,
    PostComponent,
  ],
  providers: [
    AdminService,
    MessagesService,
  ],
  imports: [
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxColorsModule,
    ColorCircleModule,
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    ChartsModule,
    NgbModule,
    NgbNavModule,
    HighlightPlusModule,
    FormsModule,
    ReactiveFormsModule,
    CodemirrorModule,
    SocketIoModule.forRoot(config),
  ]
})
export class AdminModule { }
