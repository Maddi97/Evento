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
import { AtomsModule } from "@shared/atoms/atoms.module";
import { MoleculesModule } from "@shared/molecules/molecules.module";
import { GoogleTagManagerModule } from "angular-google-tag-manager";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
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
    MoleculesModule,
    AtomsModule,
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
