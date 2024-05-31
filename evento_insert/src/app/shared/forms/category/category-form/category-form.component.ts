import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Category, Subcategory } from "src/app/globals/models/category";
import { CategoryAdditionalInfoFormComponent } from "../category-additional-info-form/category-additional-info-form.component";
import { CategoryAliasFormComponent } from "../category-alias-form/category-alias-form.component";
import { SelectFilesFormComponent } from "@shared/forms/shared/select-files-form/select-files-form.component";
import { transformFormFieldToCategory } from "@shared/logic/category.helpers";
import { FormSubmitionButtonsComponent } from "@shared/forms/shared/form-submition-buttons/form-submition-buttons.component";
@Component({
  selector: "app-category-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CategoryAdditionalInfoFormComponent,
    CategoryAliasFormComponent,
    SelectFilesFormComponent,
    FormSubmitionButtonsComponent,
  ],
  templateUrl: "./category-form.component.html",
  styleUrl: "./category-form.component.css",
})
export class CategoryFormComponent {
  @Input({ required: true }) type: "Category" | "Subcategory";
  @Input() categoryIn: Category | Subcategory;
  @Output() updateCategory: EventEmitter<Category | Subcategory> =
    new EventEmitter<Category | Subcategory>();
  @Output() addNewCategory: EventEmitter<Category | Subcategory> =
    new EventEmitter<Category>();
  categoryForm = new FormGroup({
    name: new FormControl(""),
  });
  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryIn) {
      this.categoryForm.patchValue(changes.categoryIn.currentValue);
    }
  }
  submitForm() {
    if (this.categoryIn) {
      this.emitUpdateCategory();
    } else {
      this.emitAddCategory();
    }
  }
  emitAddCategory() {
    const category = transformFormFieldToCategory(
      this.type,
      this.categoryForm,
      ""
    );
    this.addNewCategory.emit(category);
  }

  emitUpdateCategory() {
    const category = transformFormFieldToCategory(
      this.type,
      this.categoryForm,
      this.categoryIn._id
    );
    this.updateCategory.emit(category);
  }
  resetForm() {
    this.categoryForm.reset(new Category());
    this.categoryIn = undefined;
  }
}
