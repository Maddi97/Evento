import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoriesComponent } from "./categories.component";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { CategoriesRoutingModule } from "./categories-routing.module";
import { MoleculesModule } from "@shared/molecules/molecules.module";
import { AtomsModule } from "@shared/atoms/atoms.module";

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    /**
     * Material Imports
     */
    MatIconModule,
    RouterModule,
    CategoriesRoutingModule,
    MoleculesModule,
    AtomsModule,
  ],
})
export class CategoriesModule {}
