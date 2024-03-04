import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, forkJoin, of } from "rxjs";
import { concatMap, map, take } from "rxjs/operators";
import { Category, Subcategory } from "@globals/models/category";
import { CategoryService } from "@shared/services/category/category.web.service";
import { CategoryObservableService } from "@shared/services/category/category.observable.service";
import { FileUploadService } from "@shared/services/files/file-upload.service";
import { CommonModule } from "@angular/common";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { CategoryFormComponent } from "@shared/forms/category/category-form/category-form.component";
import { CategoryExpansionPanelComponent } from "@shared/molecules/category-expansion-panel/category-expansion-panel.component";
import { SnackbarService } from "@shared/services/utils/snackbar.service";
// constants
const TYPE_ADD = "add";
const TYPE_UPDATE = "update";
@Component({
  selector: "app-category-view",
  standalone: true,
  imports: [
    CommonModule,
    SelectionListComponent,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAccordion,
    MatExpansionModule,
    MatButtonModule,
    CategoryFormComponent,
    CategoryExpansionPanelComponent,
  ],
  templateUrl: "./category-view.component.html",
  styleUrls: ["./category-view.component.css"],
})
export class CategoryViewComponent implements OnInit {
  @ViewChild(CategoryFormComponent)
  categoryFormComponent: CategoryFormComponent;

  categories: Category[];
  category$;
  categoryIn: Category | Subcategory;

  icon;
  stockImage;

  constructor(
    private categoryService: CategoryService,
    private categoryObservableService: CategoryObservableService,
    private fileService: FileUploadService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.category$ = this.categoryService.getCategories().pipe(
      map((cat) => {
        this.categories = cat;
      }),
      take(1)
    );
    this.category$.subscribe();
  }

  addNewCategory(category: Category): void {
    // if (this.check_if_icon_and_stock_foto_valid(TYPE_ADD)) {
    this.categoryObservableService.addNewCategory(category).subscribe({
      next: (res) => {
        console.log(res);
      },
      complete: () => {
        this.snackbarService.openSnackBar(
          "Successfully uploaded category: " + category.name,
          "success"
        );
        this.category$.subscribe();
        this.resetForm();
      },
      error: (err) =>
        this.snackbarService.openSnackBar("An error occurred: " + err, "error"),
    });
    // }
  }

  addNewSubcategory(category: Category, subcategory: Subcategory): void {
    this.categoryObservableService
      .addNewSubcategory(category, subcategory)
      .subscribe({
        complete: () => {
          this.snackbarService.openSnackBar(
            "Successfully uploaded subcategory: " + subcategory.name,
            "success"
          );
          this.category$.subscribe();
          this.resetForm();
        },
        error: (err) =>
          this.snackbarService.openSnackBar(
            "An error occurred: " + err,
            "error"
          ),
      });
  }

  updateCategory(category: Category) {
    const oldCategory = this.categories.find((cat) => cat._id === category._id);
    this.categoryObservableService
      .updateCategory(oldCategory, category)
      .subscribe({
        complete: () => {
          this.snackbarService.openSnackBar(
            "Successfully uploaded subcategory: " + category.name,
            "success"
          );
          this.category$.subscribe();
          this.resetForm();
        },
        error: (err) =>
          this.snackbarService.openSnackBar(
            "An error occurred: " + err,
            "error"
          ),
      });
    this.resetForm();
  }

  updateSubcategory(category: Category, subcategory: Subcategory) {
    this.categoryObservableService
      .updateSubcategory(category, subcategory)
      .subscribe({
        complete: () => {
          this.snackbarService.openSnackBar(
            "Successfully uploaded subcategory: " + subcategory.name,
            "success"
          );
          this.category$.subscribe();

          this.resetForm();
        },
        error: (err) =>
          this.snackbarService.openSnackBar(
            "An error occurred: " + err,
            "error"
          ),
      });
    this.resetForm();
  }

  deleteCategory(category: Category): void {
    if (
      confirm(
        "Are you sure to delete Category " +
          category.name +
          "\nYou are not able to find the related events again"
      )
    ) {
      const deleteSubcategories$ = category.subcategories.reduce(
        (acc, subcategory) => {
          return acc.pipe(
            concatMap(() => this.deleteSubcategory(category, subcategory))
          );
        },
        of(null)
      );
      deleteSubcategories$
        .pipe(
          concatMap(() => this.categoryService.deleteCategory(category._id)),
          concatMap(() => this.fileService.deleteFile(category.stockImagePath)),
          concatMap(() => this.fileService.deleteFile(category.iconPath))
        )
        .subscribe({
          complete: () => {
            this.snackbarService.openSnackBar(
              "Successfully deleted category: " + category.name,
              "success"
            );
            this.category$.subscribe();
          },
          error: (err) =>
            this.snackbarService.openSnackBar(
              "An error occurred: " + err,
              "error"
            ),
        });
    } else {
      return;
    }
  }

  deleteSubcategory(
    category: Category,
    subcategory: Subcategory
  ): Observable<void> {
    return new Observable<void>((observer) => {
      if (
        confirm(
          "Are you sure to delete Subcategory " +
            subcategory.name +
            "\nYou are not able to find the related events again"
        )
      ) {
        category.subcategories = category.subcategories.filter(
          (subcat) => subcat.name !== subcategory.name
        );

        forkJoin([
          this.categoryService.updateCategory(category._id, category),
          this.fileService.deleteFile(subcategory.iconPath),
          this.fileService.deleteFile(subcategory.stockImagePath),
        ])
          .pipe(concatMap(() => of(null)))
          .subscribe(
            () => {
              observer.next(); // Emit a completion signal
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      } else {
        observer.complete(); // If the user cancels, just complete the observable
      }
    });
  }
  deleteSubcategoryClick(category: Category, subcategory: Subcategory) {
    this.deleteSubcategory(category, subcategory).subscribe({
      complete: () => {
        this.snackbarService.openSnackBar(
          "Successfully deleted category: " + subcategory.name,
          "success"
        );
        this.category$.subscribe();
      },
      error: (err) =>
        this.snackbarService.openSnackBar("An error occurred: " + err, "error"),
    });
  }
  resetForm() {
    this.categoryFormComponent.resetForm();
  }
}
