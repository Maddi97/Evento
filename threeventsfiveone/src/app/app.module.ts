import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterbarComponent } from './footerbar/footerbar.component';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { SettingsModule } from './settings/settings.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CommonUtilitiesModule } from './common-utilities/common-utilities.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterbarComponent,
    HeaderbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,

    /*
    Angular Material
    */
    MatIconModule,

    /*
    Own Modules
    */
    EventsModule,
    CategoriesModule,
    SettingsModule,
    CommonUtilitiesModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
