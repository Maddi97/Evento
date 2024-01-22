import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EventViewComponent } from "./pages/event/event-view/event-view.component";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { NgxSpinnerModule } from "ngx-spinner";
import { SelectionViewComponent } from "./pages/selection-view/selection-view.component";

import { HttpClientModule } from "@angular/common/http";
import { authInterceptorProviders } from "./services/auth/auth.interceptor";

import { OrganizerViewComponent } from "./pages/organizer/organizer-view/organizer-view.component";

import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { CustomDialogComponent } from "./custom-dialog/custom-dialog.component";
import { LoginComponent } from "./login/login.component";
import { CategorySelectComponent } from "./pages/category/category-select/category-select.component";
import { CategoryViewComponent } from "./pages/category/category-view/category-view.component";
import { EventCrawledComponent } from "./pages/crawl-events/atom-event-crawled/event-crawled.component";
import { CrawlEventsComponent } from "./pages/crawl-events/crawl-events.component";
import { CrawledEventsToEventComponent } from "./pages/crawl-events/crawled-events-to-event/crawled-events-to-event.component";
import { EventFormComponent } from "./pages/event/event-form/event-form.component";
import { MapViewComponent } from "./pages/map/map-view/map-view.component";
import { OrganizerFormComponent } from "./pages/organizer/organizer-form/organizer-form.component";
import { AuthGuardService } from "./services/auth/auth.guard.service";
import { AutocompleteOrganizerComponent } from "./atoms/autocomplete-organizer/autocomplete-organizer.component";
import { SelectionListComponent } from "./atoms/selection-list/selection-list.component";
import { EventFrequencyFormComponent } from "./atoms/event-frequency-form/event-frequency-form.component";
import { GlobalSettingsComponent } from "./pages/settings/global-settings/global-settings.component";
import { GlobalSettingsFormComponent } from "./pages/settings/global-settings-form/global-settings-form.component";
import { ExpansionPanelComponent } from "./molecules/expansion-panel/expansion-panel.component";
import { EventPanelComponent } from "./atoms/event-panel/event-panel.component";
import { CategoryEventExpansionPanelComponent } from './molecules/category-event-expansion-panel/category-event-expansion-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    EventViewComponent,
    SelectionViewComponent,
    OrganizerViewComponent,
    CategorySelectComponent,
    CategoryViewComponent,
    MapViewComponent,
    OrganizerFormComponent,
    EventFormComponent,
    LoginComponent,
    CustomDialogComponent,
    CrawlEventsComponent,
    EventCrawledComponent,
    CrawledEventsToEventComponent,
    AutocompleteOrganizerComponent,
    SelectionListComponent,
    EventFrequencyFormComponent,
    GlobalSettingsComponent,
    GlobalSettingsFormComponent,
    ExpansionPanelComponent,
    EventPanelComponent,
    CategoryEventExpansionPanelComponent,
  ],
  imports: [
    MatSnackBarModule,
    FormsModule,
    MatExpansionModule,
    MatDividerModule,
    MatCardModule,
    MatCheckboxModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatRadioModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxSpinnerModule,
    MatDialogModule,
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
