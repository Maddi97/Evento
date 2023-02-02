import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventTileComponent} from './event-tile/event-tile.component';
import {MapViewComponent} from './map-view/map-view.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FullEventComponent} from './full-event/full-event.component';
import {DatePickerComponent} from './date-picker/date-picker.component';
import {DayDateComponent} from './date-picker/day-date/day-date.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {SocialMediaShareComponent} from './social-media-share/social-media-share.component';
import {MatIconModule} from '@angular/material/icon';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DigitalClockComponent} from './digital-clock/digital-clock.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EventPictureComponent} from './event-picture/event-picture.component';
import {EventTileListComponent} from './event-tile-list/event-tile-list.component';
import {RouterModule} from '@angular/router';
import {CategoryListComponent} from './category-list/category-list.component';


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

  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    MatIconModule,
    ClipboardModule,
    MatSnackBarModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    EventTileComponent,
    FullEventComponent,
    DatePickerComponent,
    MapViewComponent,
    DigitalClockComponent,
    EventTileListComponent,
    CategoryListComponent
  ]
})
export class CommonUtilitiesModule {
}
