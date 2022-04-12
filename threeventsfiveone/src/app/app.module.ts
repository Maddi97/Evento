import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterbarComponent } from './footerbar/footerbar.component';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { SettingsModule } from './settings/settings.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonUtilitiesModule } from './common-utilities/common-utilities.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    FlexLayoutModule,
    NgxSpinnerModule,
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
    FontAwesomeModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
