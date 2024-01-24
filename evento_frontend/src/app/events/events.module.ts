import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventsComponent } from "./events.component";
import { CommonUtilitiesModule } from "../common-utilities/common-utilities.module";
import { AppRoutingModule } from "../app-routing.module";
import { MatIconModule } from "@angular/material/icon";
import { MatSliderModule } from "@angular/material/slider";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [EventsComponent],
  exports: [],
  imports: [
    AppRoutingModule,
    CommonModule,
    CommonUtilitiesModule,
    NgxSpinnerModule,
    /**
     * Flex
     */

    /**
     * Material Imports
     */
    MatIconModule,
    MatSliderModule,

    HttpClientModule,
    FormsModule,
  ],
})
export class EventsModule {}
