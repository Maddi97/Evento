import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { CommonUtilitiesModule } from '../common-utilities/common-utilities.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [
    CommonModule,
    CommonUtilitiesModule,
    FlexLayoutModule,
  ]
})
export class EventsModule { }
