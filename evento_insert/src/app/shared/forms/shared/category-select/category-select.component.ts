import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from "@angular/core";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";
import { Category, Subcategory } from "@globals/models/category";
import { CategoryService } from "@shared/services/category/category.web.service";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-category-select",
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: "./category-select.component.html",
  styleUrls: ["./category-select.component.css"],
})
export class CategorySelectComponent {
  parentContainer = inject(ControlContainer);
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  categoryFormControl = new FormControl(null, [Validators.required]);
  categoryList: Category[] = [];
  subcategoryList: Subcategory[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.parentFormGroup.addControl("category", this.categoryFormControl);

    //subscribe to changes of category to update the subcategoryToDisplay List
    this.parentFormGroup
      .get("category")
      .valueChanges.subscribe((categoryFromForm: Category) => {
        if (!categoryFromForm._id) {
          this.subcategoryList = [];
          return;
        }
        this.categoryList.map((category: Category) => {
          if (category._id === categoryFromForm._id) {
            this.subcategoryList = category.subcategories;
          }
        });
      });
    this.categoryService.getCategories().subscribe((category: Category[]) => {
      this.categoryList = category;
    });
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl("category");
  }
  compareWith(subcat1: any, subcat2: any): boolean {
    return subcat1 && subcat2 && subcat1._id === subcat2._id;
  }
  onSelectCategory(category: Category) {
    this.categoryFormControl.setValue({ ...category, subcategories: [] });
  }
}
