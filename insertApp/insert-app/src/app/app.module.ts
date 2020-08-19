import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventViewComponent } from './pages/event-view/event-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {SelectionViewComponent } from './pages/selection-view/selection-view.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';

import { HttpClientModule } from "@angular/common/http";
import { OrganizerViewComponent } from './pages/organizer-view/organizer-view.component'


@NgModule({
  declarations: [
    AppComponent,
    EventViewComponent,
    SelectionViewComponent,
    OrganizerViewComponent
  ],
  imports: [
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
