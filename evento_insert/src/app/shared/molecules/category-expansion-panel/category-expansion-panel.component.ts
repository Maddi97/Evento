import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { Category, Subcategory } from "@globals/models/category";
import { CategoryImageComponent } from "@shared/atoms/category-image/category-image.component";
import { SubcategoryPanelComponent } from "@shared/atoms/subcategory-panel/subcategory-panel.component";
import { CategoryFormComponent } from "@shared/forms/category/category-form/category-form.component";

@Component({
  selector: "app-category-expansion-panel",
  standalone: true,
  imports: [
    MatExpansionModule,
    SubcategoryPanelComponent,
    CategoryFormComponent,
    CategoryImageComponent,
  ],
  templateUrl: "./category-expansion-panel.component.html",
  styleUrl: "./category-expansion-panel.component.css",
})
export class CategoryExpansionPanelComponent {
  @Input({ required: true }) categoryIn: Category;
  @Output() editCategory: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() deleteCategory: EventEmitter<Category> =
    new EventEmitter<Category>();
  @Output() addNewSubategory: EventEmitter<Subcategory> =
    new EventEmitter<Subcategory>();
  @Output() updateSubcategory: EventEmitter<Subcategory> =
    new EventEmitter<Subcategory>();
  @Output() deleteSubcategory: EventEmitter<Subcategory> =
    new EventEmitter<Subcategory>();

  subcategoryIn: Subcategory;
}
