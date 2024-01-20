import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CategoryListComponent } from './category-list/category-list.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DayDateComponent } from './date-picker/day-date/day-date.component';
import { DigitalClockComponent } from './digital-clock/digital-clock.component';
import { EventPictureComponent } from './event-picture/event-picture.component';
import { EventTileListComponent } from './event-tile-list/event-tile-list.component';
import { EventTileComponent } from './event-tile/event-tile.component';
import { FullEventComponent } from './full-event/full-event.component';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { SharedObservableService } from './logic/shared-observables.service';
import { MapViewComponent } from './map-view/map-view.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SocialMediaShareComponent } from './social-media-share/social-media-share.component';
import { GoogleAdsComponent } from './google-ads/google-ads.component';

@NgModule({
  declarations: [
    EventTileComponent,
    FullEventComponent,
    DatePickerComponent,
    DayDateComponent,
    MapViewComponent,
    SocialMediaShareComponent,
    DigitalClockComponent,
    EventPictureComponent,
    EventTileListComponent,
    CategoryListComponent,
    HamburgerMenuComponent,
    SearchFilterComponent,
    GoogleAdsComponent,

  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    MatIconModule,
    ClipboardModule,
    MatSnackBarModule,
    FontAwesomeModule,
    RouterModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    LazyLoadImageModule,
    NgxSpinnerModule
  ],
  exports: [
    EventTileComponent,
    FullEventComponent,
    DatePickerComponent,
    MapViewComponent,
    DigitalClockComponent,
    EventTileListComponent,
    CategoryListComponent,
    HamburgerMenuComponent,
    SearchFilterComponent,
  ],
  providers: [
    SharedObservableService
  ]
})
export class CommonUtilitiesModule {
}
