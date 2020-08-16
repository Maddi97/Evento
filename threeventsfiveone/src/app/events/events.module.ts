import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { CommonUtilitiesModule } from '../common-utilities/common-utilities.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from '../app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';



@NgModule({
  declarations: [
    EventsComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    CommonUtilitiesModule,
    /**
     * Flex
     */
    FlexLayoutModule,

    /**
     * Material Imports
     */
    MatIconModule,
    MatSliderModule,
  ]
})
export class EventsModule { }
