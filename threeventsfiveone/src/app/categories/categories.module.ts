import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoryTileComponent } from './category-tile/category-tile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryTileComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    /**
     * Material Imports
     */
    MatIconModule,
    RouterModule,
  ]
})
export class CategoriesModule { }
