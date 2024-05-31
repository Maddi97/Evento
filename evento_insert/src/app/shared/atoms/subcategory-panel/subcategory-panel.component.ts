import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Subcategory } from "@globals/models/category";
import { CategoryImageComponent } from "@shared/atoms/category-image/category-image.component";
@Component({
  selector: "app-subcategory-panel",
  standalone: true,
  imports: [CategoryImageComponent],
  templateUrl: "./subcategory-panel.component.html",
  styleUrl: "./subcategory-panel.component.css",
})
export class SubcategoryPanelComponent {
  @Input({ required: true }) subcategoryIn: Subcategory;
  @Output() updateSubcategory: EventEmitter<Subcategory> =
    new EventEmitter<Subcategory>();
  @Output() deleteSubcategory: EventEmitter<Subcategory> =
    new EventEmitter<Subcategory>();
}
