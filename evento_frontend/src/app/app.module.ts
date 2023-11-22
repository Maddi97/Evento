import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';
import { FooterbarComponent } from './footerbar/footerbar.component';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { SettingsModule } from './settings/settings.module';

import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { CommonUtilitiesModule } from './common-utilities/common-utilities.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterbarComponent,
    HeaderbarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    /*
    Angular Material
    */
    MatIconModule,
    MatDialogModule,
    /*
    Own Modules
    */
    EventsModule,
    CategoriesModule,
    SettingsModule,
    CommonUtilitiesModule,
    NgxSpinnerModule,
    GoogleTagManagerModule

  ],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }, {provide: 'googleTagManagerId', useValue: 'GTM-KHTB234N'}],
  schemas: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
