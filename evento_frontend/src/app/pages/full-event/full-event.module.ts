import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FullEventComponent } from "./full-event.component";
import { MoleculesModule } from "../../shared/molecules/molecules.module";
import { FullEventRoutingModule } from "./full-event-routing.module";
//TODO should only need molecules
import { AtomsModule } from "../../shared/atoms/atoms.module";
@NgModule({
  declarations: [FullEventComponent],
  imports: [CommonModule, MoleculesModule, AtomsModule, FullEventRoutingModule],
})
export class FullEventModule {}
