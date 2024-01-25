import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { NgxSpinnerModule } from "ngx-spinner";
import { CategoryListComponent } from "./category-list/category-list.component";
import { EventTileListComponent } from "./event-tile-list/event-tile-list.component";
import { MapViewComponent } from "./map-view/map-view.component";
import { SearchFilterComponent } from "./search-filter/search-filter.component";
import { SocialMediaShareComponent } from "./social-media-share/social-media-share.component";
import { GoogleAdsComponent } from "./google-ads/google-ads.component";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { ImpressumComponent } from "./impressum/impressum.component";
import { DatenschutzComponent } from "./datenschutz/datenschutz.component";
import { InsertEventComponent } from "./insert-event/insert-event.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { FooterbarComponent } from "./footerbar/footerbar.component";
import { HeaderbarComponent } from "./headerbar/headerbar.component";
import { AtomsModule } from "@shared/atoms/atoms.module";
@NgModule({
  declarations: [
    DatePickerComponent,
    MapViewComponent,
    SocialMediaShareComponent,
    EventTileListComponent,
    CategoryListComponent,
    SearchFilterComponent,
    GoogleAdsComponent,
    ImpressumComponent,
    DatenschutzComponent,
    InsertEventComponent,
    FeedbackComponent,
    FooterbarComponent,
    HeaderbarComponent,
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    ClipboardModule,
    MatSnackBarModule,
    FontAwesomeModule,
    RouterModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    LazyLoadImageModule,
    NgxSpinnerModule,
    AtomsModule,
  ],
  exports: [
    DatePickerComponent,
    MapViewComponent,
    SocialMediaShareComponent,
    EventTileListComponent,
    CategoryListComponent,
    SearchFilterComponent,
    GoogleAdsComponent,
    ImpressumComponent,
    DatenschutzComponent,
    InsertEventComponent,
    FeedbackComponent,
    FooterbarComponent,
    HeaderbarComponent,
  ],
})
export class MoleculesModule {}
