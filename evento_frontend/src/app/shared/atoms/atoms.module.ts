import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { EventPictureComponent } from "./event-picture/event-picture.component";
import { EventTileComponent } from "./event-tile/event-tile.component";
import { AppStoreBannerComponent } from "./app-store-banner/app-store-banner.component";
import { DayDateComponent } from "./day-date/day-date.component";
import { DigitalClockComponent } from "./digital-clock/digital-clock.component";
import { HamburgerMenuComponent } from "./hamburger-menu/hamburger-menu.component";

@NgModule({
  declarations: [
    EventTileComponent,
    EventPictureComponent,
    AppStoreBannerComponent,
    EventPictureComponent,
    DayDateComponent,
    DigitalClockComponent,
    HamburgerMenuComponent,
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    ClipboardModule,
    MatSnackBarModule,
    FontAwesomeModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    LazyLoadImageModule,
  ],
  exports: [
    EventPictureComponent,
    EventTileComponent,
    DigitalClockComponent,
    HamburgerMenuComponent,
    AppStoreBannerComponent,
    DayDateComponent,
  ],
})
export class AtomsModule {}
