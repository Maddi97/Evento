import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventViewComponent } from './pages/event/event-view/event-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SelectionViewComponent } from './pages/selection-view/selection-view.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';



import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptorProviders } from './services/auth.interceptor';

import { OrganizerViewComponent } from './pages/organizer/organizer-view/organizer-view.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CategorySelectComponent } from './pages/category/category-select/category-select.component';
import { CategoryViewComponent } from './pages/category/category-view/category-view.component';
import { MapViewComponent } from './pages/map/map-view/map-view.component'
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { OrganizerFormComponent } from './pages/organizer/organizer-form/organizer-form.component';
import { EventFormComponent } from './pages/event/event-form/event-form.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth.guard.service';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';


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
        CustomDialogComponent
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
        FlexLayoutModule,
        NgxMaterialTimepickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgxSpinnerModule,
        MatDialogModule
    ],
    providers: [
        AuthGuardService,
        authInterceptorProviders,
        Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
