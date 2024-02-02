import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SettingsComponent } from "./settings.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SettingsRoutingModule } from "./settings-routing.module";
import { MoleculesModule } from "@shared/molecules/molecules.module";
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    SettingsRoutingModule,
    MoleculesModule,
  ],
})
export class SettingsModule {}
