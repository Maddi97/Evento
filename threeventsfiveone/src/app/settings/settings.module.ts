import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {InsertEventComponent} from './pages/insert-event/insert-event.component';
import {DatenschutzComponent} from './pages/datenschutz/datenschutz.component';
import {ImpressumComponent} from './pages/impressum/impressum.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SettingsComponent,
    InsertEventComponent,
    DatenschutzComponent,
    ImpressumComponent,

  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule {
}
