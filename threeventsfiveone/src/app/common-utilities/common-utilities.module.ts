import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTileComponent } from './event-tile/event-tile.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    EventTileComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    EventTileComponent,
  ]
})
export class CommonUtilitiesModule { }
