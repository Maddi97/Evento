import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventViewComponent } from './pages/event-view/event-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {SelectionViewComponent } from './pages/selection-view/selection-view.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar'

import { LeafletModule } from '@asymmetrik/ngx-leaflet';


import { HttpClientModule } from "@angular/common/http";
import { OrganizerViewComponent } from './pages/organizer-view/organizer-view.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CategorySelectComponent } from './pages/category-select/category-select.component';
import { CategoryViewComponent } from './pages/category-view/category-view.component';
import { MapViewComponent} from './map-view/map-view.component'


@NgModule({
  declarations: [
    AppComponent,
    EventViewComponent,
    SelectionViewComponent,
    OrganizerViewComponent,
    CategorySelectComponent,
    CategoryViewComponent,
    MapViewComponent
  ],
  imports: [
    LeafletModule,
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
    FlexLayoutModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
