import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EventViewComponent} from './pages/event/event-view/event-view.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {SelectionViewComponent} from './pages/selection-view/selection-view.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgxSpinnerModule} from 'ngx-spinner';


import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {authInterceptorProviders} from './services/auth.interceptor';

import {OrganizerViewComponent} from './pages/organizer/organizer-view/organizer-view.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import {MatNativeDateModule} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CategorySelectComponent} from './pages/category/category-select/category-select.component';
import {CategoryViewComponent} from './pages/category/category-view/category-view.component';
import {MapViewComponent} from './pages/map/map-view/map-view.component'
import {CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {OrganizerFormComponent} from './pages/organizer/organizer-form/organizer-form.component';
import {EventFormComponent} from './pages/event/event-form/event-form.component';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './services/auth.guard.service';


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
        LoginComponent
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
        NgxSpinnerModule
    ],
    providers: [
        AuthGuardService,
        authInterceptorProviders,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
