import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable, forkJoin, of } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { Category, Subcategory } from "@globals/models/category";
import { CategoryService } from "@shared/services/category/category.service";
import { FileUploadService } from "@shared/services/files/file-upload.service";
import { CommonModule } from "@angular/common";
import { SelectionListComponent } from "@shared/atoms/selection-list/selection-list.component";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAccordion, MatExpansionModule } from "@angular/material/expansion";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

// constants
const TYPE_ADD = "add";
const TYPE_UPDATE = "update";
const TYPE_CATEGORY = "category";
const TYPE_SUBCATEGORY = "subcategory";

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
  ],
  templateUrl: "./category-view.component.html",
  styleUrls: ["./category-view.component.css"],
})
export class CategoryViewComponent implements OnInit {
  @ViewChild("iconUpload")
  inputCat: ElementRef;
  @ViewChild("stockFotoUpload")
  inputCat2: ElementRef;

  @ViewChild("iconUploadSubcat")
  inputSubcat: ElementRef;
  @ViewChild("stockFotoUploadSubcat")
  inputUpdateSubcat: ElementRef;

  stockImagePath = "images/category_stockImages/";
  iconPath = "images/category_icons/";

  categoryName = new FormControl("");
  weightFormValue = new FormControl("0", [
    Validators.min(0),
    Validators.max(100),
  ]);
  alias: string[] = [];
  currentAlias = new FormControl("");
  weightFormValueSubcat = new FormControl("0");
  subcategoryName = new FormControl("");
  categories: Category[];
  category$;
  updateCategory$;
  createCategory$;
  uploadFile$;

  icon: File;
  stockImage: File;
  chosen: boolean;
  clickedSubcategory: number;
  update = false;
  updateSub = false;
  updateCategoryObject;
  updateSubcategoryObject;

  private allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
  private uploadedIconSize = 50000;
  private uploadedStockImageSize = 500000; // 500KB?

  constructor(
    private categoryService: CategoryService,
    private fileService: FileUploadService,
    private sanitizer: DomSanitizer,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.category$ = this.categoryService.getCategories().pipe(
      map((cat) => {
        this.downloadImage(cat);
        this.categories = cat;
      })
    );
    this.category$.subscribe();
    this.updateCategory$ = (id, category) =>
      this.categoryService.updateCategory(id, category);
    this.uploadFile$ = (formdata) =>
      this.fileService.uploadCategoryFiles(formdata);
    this.createCategory$ = (category) =>
      this.categoryService.createCategory(category);
  }

  // complex subscriptions
  completeAddCategory$ = (category) =>
    this.createCategory$(category).pipe(
      map((createCategoryResponse: Category) => {
        const formdata = this.prepare_formdata(
          createCategoryResponse._id,
          TYPE_CATEGORY
        );

        this.uploadFile$(formdata).subscribe((response) => {
          createCategoryResponse.iconPath = response.icon.path;
          createCategoryResponse.stockImagePath = response.stockImage.path;
          this.updateCategory$(
            createCategoryResponse._id,
            createCategoryResponse
          );
        });
      })
    );

  completeAddSubcategory$ = (category, subcategory) =>
    this.updateCategory$(category._id, category).pipe(
      map((updateCategoryResponse: Category) => {
        category = updateCategoryResponse;
        subcategory = category.subcategories.find(
          (sub) => sub.name === subcategory.name
        );
        const formdata: FormData = this.prepare_formdata(
          [updateCategoryResponse._id, subcategory._id],
          TYPE_SUBCATEGORY
        );

        this.uploadFile$(formdata).subscribe((response) => {
          category.subcategories.map((sub) => {
            if (sub._id === subcategory._id) {
              sub.iconPath = response.icon.path;
              sub.stockImagePath = response.stockImage.path;
            }
          });
          this.updateCategory$(category._id, category);
        });
      })
    );

  uploadIconAndUpdateCategory$ = (formdata, category) =>
    this.uploadFile$(formdata).pipe(
      map((response: any) => {
        category.iconPath = response.icon.path;
        this.updateCategory$(category._id, category);
      })
    );

  uploadStockImageAndUpdateCategory$ = (formdata, category) =>
    this.uploadFile$(formdata).pipe(
      map((response: any) => {
        category.stockImagePath = response.stockImage.path;
        this.updateCategory$(category._id, category);
      })
    );

  uploadIconUpdateSubcategory$ = (category, subcategory) =>
    this.updateCategory$(category._id, category).pipe(
      map((updateCategoryResponse: Category) => {
        const subcategoryIconPath =
          this.iconPath + updateCategoryResponse._id + "/" + subcategory._id;
        const formdata: FormData = new FormData();
        formdata.append("files", this.icon);
        formdata.append("file_path", subcategoryIconPath);
        this.uploadFile$(formdata).subscribe((response) => {
          updateCategoryResponse.subcategories.map((sub) => {
            if (sub._id === subcategory._id) {
              sub.iconPath = response.icon.path;
            }
          });
          this.categoryService.updateCategory(
            updateCategoryResponse._id,
            updateCategoryResponse
          );
        });
      })
    );
  uploadStockFotoUpdateSubcategory$ = (category, subcategory) =>
    this.updateCategory$(category._id, category).pipe(
      map((updateCategoryResponse: Category) => {
        const subcategoryStockImagePath =
          this.stockImagePath +
          updateCategoryResponse._id +
          "/" +
          subcategory._id;
        const formdata: FormData = new FormData();
        formdata.append("files", this.stockImage);
        formdata.append("stockImagePath", subcategoryStockImagePath);
        // TODO delete old Icon
        this.uploadFile$(formdata)
          .pipe(
            map((response: any) => {
              updateCategoryResponse.subcategories.map((sub) => {
                if (sub._id === subcategory._id) {
                  sub.stockImagePath = response.stockImage.path;
                }
              });
              this.updateCategory$(
                updateCategoryResponse._id,
                updateCategoryResponse
              );
            })
          )
          .subscribe();
      })
    );

  // functions
  addNewCategory(): void {
    if (this.check_if_icon_and_stock_foto_valid(TYPE_ADD)) {
      const category = new Category();
      category.name = this.categoryName.value;
      category.weight = this.weightFormValue.value;
      this.completeAddCategory$(category).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded category: " + category.name,
            "success"
          );
          this.resetForms();
        },
        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    }
  }

  addNewSubcategory(category: Category): void {
    if (this.check_if_icon_and_stock_foto_valid(TYPE_ADD)) {
      const subcategory = new Subcategory();
      subcategory.name = this.subcategoryName.value;
      subcategory.weight = this.weightFormValueSubcat.value;
      category.subcategories.push(subcategory);
      this.completeAddSubcategory$(category, subcategory).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded subcategory: " + subcategory.name,
            "success"
          );
          this.resetForms();
        },
        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    }
  }

  updateCategory() {
    if (!this.check_if_icon_and_stock_foto_valid(TYPE_UPDATE)) {
      return;
    }

    const category = this.updateCategoryObject;
    category.name = this.categoryName.value;
    category.weight = this.weightFormValue.value;

    if (this.icon && !this.stockImage) {
      const categoryImagePath = this.iconPath + category._id;
      const formdata: FormData = new FormData();
      formdata.append("files", this.icon);
      formdata.append("file_path", categoryImagePath);
      // TODO delete old Icon
      this.uploadIconAndUpdateCategory$(formdata, category).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded category: " + category.name,
            "success"
          );
          this.resetForms();
        },

        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    }
    if (this.stockImage && !this.icon) {
      const categoryStockImagePath = this.iconPath + category._id;
      const formdata: FormData = new FormData();
      formdata.append("files", this.stockImage);
      formdata.append("stockImagePath", categoryStockImagePath);
      // TODO delete old Icon
      this.uploadStockImageAndUpdateCategory$(formdata, category).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded category: " + category.name,
            "success"
          );
          this.resetForms();
        },

        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    }
    if (this.icon && this.stockImage) {
      const categoryImagePath = this.iconPath + category._id;
      const categoryStockImagePath = this.iconPath + category._id;

      const formdata1: FormData = new FormData();
      const formdata2: FormData = new FormData();

      formdata1.append("files", this.icon);
      formdata1.append("file_path", categoryImagePath);
      formdata2.append("files", this.stockImage);
      formdata2.append("stockImagePath", categoryStockImagePath);

      forkJoin([
        this.uploadIconAndUpdateCategory$(formdata1, category),
        this.uploadStockImageAndUpdateCategory$(formdata2, category),
      ]).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded category: " + category.name,
            "success"
          );
          this.resetForms();
        },

        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    } else if (!this.icon && !this.stockImage) {
      this.updateCategory$(category._id, category).subscribe(
        (categoryResponse) =>
          this.openSnackBar(
            "Successfully uploaded category: " + categoryResponse.name,
            "success"
          ),
        (err) => this.openSnackBar("An error occurred: " + err, "error")
      );
      this.resetForms();
    }
  }

  updateSubcategory(category) {
    if (!this.check_if_icon_and_stock_foto_valid(TYPE_UPDATE)) {
      return;
    }
    const updateCategory = category;
    const subcategory = this.updateSubcategoryObject;
    subcategory.name = this.subcategoryName.value;
    subcategory.weight = this.weightFormValueSubcat.value;
    if (this.icon && !this.stockImage) {
      this.uploadIconUpdateSubcategory$(category, subcategory).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded subcategory: " + subcategory.name,
            "success"
          );
          this.resetForms();
        },
        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    }
    if (this.stockImage && !this.icon) {
      this.uploadStockFotoUpdateSubcategory$(category, subcategory).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded subcategory: " + subcategory.name,
            "success"
          );
          this.resetForms();
        },
        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    }
    if (this.icon && this.stockImage) {
      forkJoin([
        this.uploadIconUpdateSubcategory$(category, subcategory),
        this.uploadStockFotoUpdateSubcategory$(category, subcategory),
      ]).subscribe({
        complete: () => {
          this.openSnackBar(
            "Successfully uploaded subcategory: " + subcategory.name,
            "success"
          );
          this.resetForms();
        },
        error: (err) => this.openSnackBar("An error occurred: " + err, "error"),
      });
    } else if (!this.icon && !this.stockImage) {
      console.log(updateCategory);
      this.updateCategory$(updateCategory._id, updateCategory).subscribe(
        (categoryResponse) =>
          this.openSnackBar(
            "Successfully uploaded category: " + categoryResponse.name,
            "success"
          ),
        (err) => this.openSnackBar("An error occurred: " + err, "error")
      );
      this.resetForms();
    }
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
        .subscribe();
    } else {
      return;
    }
  }

  check_if_icon_and_stock_foto_valid(type: string) {
    const valid = false;
    if (this.icon && this.icon.size > this.uploadedIconSize) {
      this.openSnackBar("Icon size too big!", "error");
      this.resetForms();
      return valid;
    }
    if (this.icon && !this.allowedImageTypes.includes(this.icon.type)) {
      this.openSnackBar(
        "File type of icon " + this.icon.type + " is not allowed",
        "error"
      );
      this.resetForms();
      return valid;
    }
    if (this.stockImage && this.stockImage.size > this.uploadedStockImageSize) {
      this.openSnackBar("Stock foto size too big!", "error");
      this.resetForms();
      return valid;
    }
    if (
      this.stockImage &&
      !this.allowedImageTypes.includes(this.stockImage.type)
    ) {
      this.openSnackBar(
        "File type " + this.icon.type + " is not allowed for stock foto",
        "error"
      );
      this.resetForms();
      return valid;
    }
    if (type === TYPE_ADD) {
      if (!this.icon) {
        this.openSnackBar(
          "No image uploaded, but its necessary for a category!",
          "error"
        );
        this.resetForms();
        return valid;
      }
      if (!this.stockImage) {
        this.openSnackBar(
          "No image uploaded, but its necessary for a category!",
          "error"
        );
        this.resetForms();
        return valid;
      }
    }
    if (type === TYPE_UPDATE) {
      // optional add different criteria for update, right now check inside func
    }
    return true;
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

  prepare_formdata(id, type) {
    if (type === TYPE_CATEGORY) {
      const categoryImagePath = this.iconPath + id;
      const formdata: FormData = new FormData();
      formdata.append("files", this.icon);
      formdata.append("file_path", categoryImagePath);

      const categoryStockImagePath = this.stockImagePath + id;
      formdata.append("files", this.stockImage);
      formdata.append("stockImagePath", categoryStockImagePath);
      return formdata;
    }
    if (type === TYPE_SUBCATEGORY) {
      const subcategoryImagePath = this.iconPath + id[0] + "/" + id[1];
      const formdata: FormData = new FormData();
      formdata.append("files", this.icon);
      formdata.append("file_path", subcategoryImagePath);
      const subcategoryStockImagePath =
        this.stockImagePath + id[0] + "/" + id[1];
      formdata.append("files", this.stockImage);
      formdata.append("stockImagePath", subcategoryStockImagePath);
      return formdata;
    }
  }

  iconChosen(event: any) {
    if (event.target.value) {
      this.icon = event.target.files[0] as File;
      this.chosen = true;
    }
  }

  stockImageChosen(event: any) {
    if (event.target.value) {
      this.stockImage = event.target.files[0] as File;
      // this.chosen = true
    }
  }

  downloadImage(categories) {
    categories.forEach((cat) => {
      if (cat.iconPath !== undefined) {
        if (cat.iconTemporaryURL === undefined) {
          this.fileService.downloadFile(cat.iconPath).subscribe((imageData) => {
            // create temporary Url for the downloaded image and bypass security
            const unsafeImg = URL.createObjectURL(imageData);
            cat.iconTemporaryURL =
              this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
          });
          this.fileService
            .downloadFile(cat.stockImagePath)
            .subscribe((imageData) => {
              // create temporary Url for the downloaded image and bypass security
              const unsafeImg = URL.createObjectURL(imageData);
              cat.stockImageTemporaryURL =
                this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
            });
        }
      }
      if (cat.subcategories.length > 0) {
        cat.subcategories.forEach((sub) => {
          if (sub.iconPath !== undefined) {
            if (sub.iconTemporaryURL === undefined) {
              this.fileService
                .downloadFile(sub.iconPath)
                .subscribe((imageData) => {
                  // create temporary Url for the downloaded image and bypass security
                  const unsafeImg = URL.createObjectURL(imageData);
                  sub.iconTemporaryURL =
                    this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                });
              this.fileService
                .downloadFile(sub.stockImagePath)
                .subscribe((imageData) => {
                  // create temporary Url for the downloaded image and bypass security
                  const unsafeImg = URL.createObjectURL(imageData);
                  sub.stockImageTemporaryURL =
                    this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
                });
            }
          }
        });
      }
    });
  }

  clickSubcategory(id) {
    if (id === this.clickedSubcategory) {
      this.clickedSubcategory = 0;
    } else {
      this.clickedSubcategory = id;
    }
  }

  editCategoryClicked(category) {
    const value =
      this.categoryName.value !== category.name ? category.name : "";
    const weight =
      this.weightFormValue.value !== category.weight ? category.weight : "0";
    this.update = !this.update;
    this.updateCategoryObject = category;
    this.categoryName.setValue(value);
    this.weightFormValue.setValue(weight);
  }

  editSubcategoryClicked(category, sub) {
    const value = this.subcategoryName.value !== sub.name ? sub.name : "";
    const weight =
      this.weightFormValueSubcat.value !== sub.weight ? sub.weight : "0";

    this.updateSub = !this.updateSub;
    this.updateSubcategoryObject = sub;
    this.subcategoryName.setValue(value);
    this.weightFormValueSubcat.setValue(weight);
  }

  openSnackBar(message, state) {
    this._snackbar.open(message, "", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: [state !== "error" ? "green-snackbar" : "red-snackbar"],
    });
  }

  resetForms() {
    this.categoryName.reset();
    this.weightFormValue.reset();
    this.subcategoryName.reset();
    this.weightFormValueSubcat.reset();
    this.icon = null;
    this.stockImage = null;
    this.inputCat.nativeElement.value = "";
    this.inputCat2.nativeElement.value = "";
    this.updateCategoryObject = null;
    this.update = false;
    this.updateSubcategoryObject = null;
    this.updateSub = false;
  }
  addAlias(alias: string) {
    console.log(alias);
    if (this.alias.find((name) => name === alias)) {
      this.alias = this.alias.filter((name) => name !== alias);
    } else this.alias.push(alias);
  }
}
