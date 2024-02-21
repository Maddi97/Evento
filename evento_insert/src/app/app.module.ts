import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NgxSpinnerModule } from "ngx-spinner";
import { SelectionViewComponent } from "./shared/molecules/selection-view/selection-view.component";

import { HttpClientModule } from "@angular/common/http";
import { authInterceptorProviders } from "@shared/services/auth/auth.interceptor";

import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { AuthGuardService } from "@shared/services/auth/auth.guard.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    NgxSpinnerModule,
    SelectionViewComponent,
  ],
  providers: [
    AuthGuardService,
    authInterceptorProviders,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
