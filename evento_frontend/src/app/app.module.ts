import { NgModule } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from "@angular/platform-browser";

import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GoogleTagManagerModule } from "angular-google-tag-manager";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderbarComponent } from "@shared/molecules/headerbar/headerbar.component";
import { AppStoreBannerComponent } from "@shared/atoms/app-store-banner/app-store-banner.component";
import { CategoryListComponent } from "@shared/molecules/category-list/category-list.component";
import { FooterbarComponent } from "@shared/molecules/footerbar/footerbar.component";
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    /*
    Angular Material
    */
    /*
    Own Modules
    */
    GoogleTagManagerModule,
    HttpClientModule,
    HeaderbarComponent,
    AppStoreBannerComponent,
    CategoryListComponent,
    FooterbarComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: "googleTagManagerId", useValue: "GTM-KHTB234N" },
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  schemas: [],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
