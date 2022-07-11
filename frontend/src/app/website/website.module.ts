import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteComponent } from './website.component';
import { WebsiteRoutingModule } from './website-routing.module';

@NgModule({
  declarations: [
    WebsiteComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
  ]
})
export class WebsiteModule { }
