import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTileComponent } from './event-tile/event-tile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullEventComponent } from './full-event/full-event.component';


@NgModule({
  declarations: [
    EventTileComponent,
    FullEventComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    EventTileComponent,
    FullEventComponent,
  ]
})
export class CommonUtilitiesModule { }
