import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventsComponent } from "./events.component";
import { MatIconModule } from "@angular/material/icon";
import { MatSliderModule } from "@angular/material/slider";
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { EventsRoutingModule } from "./events-routing.module";
import { MoleculesModule } from "@shared/molecules/molecules.module";
import { AtomsModule } from "@shared/atoms/atoms.module";

@NgModule({
  declarations: [EventsComponent],
  exports: [],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatIconModule,
    MatSliderModule,
    HttpClientModule,
    FormsModule,
    EventsRoutingModule,
    MoleculesModule,
    NgxSpinnerModule,
    AtomsModule,
  ],
  providers: [],
})
export class EventsModule {}
