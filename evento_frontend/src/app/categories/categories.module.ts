import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoryTileComponent } from './category-tile/category-tile.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryTileComponent
  ],
  imports: [
    CommonModule,
    /**
     * Material Imports
     */
    MatIconModule,
    RouterModule,
  ]
})
export class CategoriesModule { }
