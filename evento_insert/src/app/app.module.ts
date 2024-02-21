import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EventViewComponent } from "./pages/event-view/event-view.component";

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
import { NgxSpinnerModule } from "ngx-spinner";
import { SelectionViewComponent } from "./shared/molecules/selection-view/selection-view.component";

import { HttpClientModule } from "@angular/common/http";
import { authInterceptorProviders } from "@shared/services/auth/auth.interceptor";

import { OrganizerViewComponent } from "./pages/organizer-view/organizer-view.component";

import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { CustomDialogComponent } from "@atoms/custom-dialog/custom-dialog.component";
import { LoginComponent } from "./pages/login/login.component";
import { CategorySelectComponent } from "./shared/molecules/category-select/category-select.component";
import { CategoryViewComponent } from "./pages/category-view/category-view.component";
import { EventCrawledComponent } from "./shared/atoms/atom-event-crawled/event-crawled.component";
import { CrawlEventsComponent } from "./pages/crawl-events/crawl-events.component";
import { CrawledEventsToEventComponent } from "./shared/molecules/crawled-events-to-event/crawled-events-to-event.component";
import { EventFormComponent } from "./shared/molecules/event-form/event-form.component";
import { MapViewComponent } from "./shared/molecules/map-view/map-view.component";
import { OrganizerFormComponent } from "./shared/molecules/organizer-form/organizer-form.component";
import { AuthGuardService } from "@shared/services/auth/auth.guard.service";
import { AutocompleteOrganizerComponent } from "@atoms/autocomplete-organizer/autocomplete-organizer.component";
import { SelectionListComponent } from "@atoms/selection-list/selection-list.component";
import { EventFrequencyFormComponent } from "@atoms/event-frequency-form/event-frequency-form.component";
import { GlobalSettingsComponent } from "./pages/settings/global-settings/global-settings.component";
import { GlobalSettingsFormComponent } from "./pages/settings/global-settings-form/global-settings-form.component";
import { ExpansionPanelComponent } from "./shared/molecules/expansion-panel/expansion-panel.component";
import { EventPanelComponent } from "@atoms/event-panel/event-panel.component";
import { CategoryEventExpansionPanelComponent } from "./shared/molecules/category-event-expansion-panel/category-event-expansion-panel.component";

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
