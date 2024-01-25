import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GoogleTagManagerModule } from "angular-google-tag-manager";
import { HttpClientModule } from "@angular/common/http";
import { FullEventModule } from "./pages/full-event/full-event.module";
import { MoleculesModule } from "@shared/molecules/molecules.module";
import { AtomsModule } from "@shared/atoms/atoms.module";
@NgModule({
  declarations: [AppComponent],
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
    NgxSpinnerModule,
    GoogleTagManagerModule,
    HttpClientModule,
    MoleculesModule,
    AtomsModule,
    FullEventModule,
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: "googleTagManagerId", useValue: "GTM-KHTB234N" },
  ],
  schemas: [],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
