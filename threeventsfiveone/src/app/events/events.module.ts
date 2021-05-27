import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { CommonUtilitiesModule } from '../common-utilities/common-utilities.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from '../app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule } from "@angular/common/http";
import {MapViewComponent} from "../map-view/map-view.component";


@NgModule({
  declarations: [
    EventsComponent,
    MapViewComponent
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


        HttpClientModule,
    ]
})
export class EventsModule { }
