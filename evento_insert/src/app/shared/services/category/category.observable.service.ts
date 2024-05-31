import { Injectable } from "@angular/core";
import { CategoryService } from "./category.web.service";
import { Category, Subcategory } from "@globals/models/category";
import { FileUploadService } from "../files/file-upload.service";
import { forkJoin, switchMap, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryObservableService {
  constructor(
    private categoryService: CategoryService,
    private fileUploadService: FileUploadService
  ) {}
  stockImagePath = "images/category_stockImages/";
  iconPath = "images/category_icons/";
  private _propertiesToIgnore = [
    "iconTemporaryURL",
    "iconPath",
    "stockImageTemporaryURL",
    "stockImagePath",
    "subcategories",
  ];
  addNewCategory(category: Category) {
    return this.categoryService.createCategory(category).pipe(
      tap((categoryResponse) => {
        category._id = categoryResponse._id;
        category.iconFd.append(
          "categoryImagePath",
          this.iconPath + categoryResponse._id
        );
        category.stockPhotoFd.append(
          "categoryImagePath",
          this.stockImagePath + categoryResponse._id
        );
      }),
      switchMap(() =>
        this.fileUploadService.uploadCategoryImage(category.iconFd)
      ),
      tap((iconResponse) => {
        category.iconPath = iconResponse.categoryImage.path;
      }),
      switchMap(() =>
        this.fileUploadService.uploadCategoryImage(category.stockPhotoFd)
      ),
      tap(
        (stockImageRes) =>
          (category.stockImagePath = stockImageRes.categoryImage.path)
      ),
      switchMap(() => {
        return this.categoryService.updateCategory(category._id, category);
      })
    );
  }
  updateCategory(category: Category, newCategory: Category) {
    category = this._updateNewValuesInOldObject(category, newCategory);
    const uploadObservables = [];
    if (newCategory.iconFd) {
      newCategory.iconFd.append(
        "categoryImagePath",
        this.iconPath + newCategory._id
      );
      const icon$ = this.fileUploadService.uploadCategoryImage(
        newCategory.iconFd
      );
      uploadObservables.push(icon$);
    }
    if (newCategory.stockPhotoFd) {
      newCategory.stockPhotoFd.append(
        "categoryImagePath",
        this.stockImagePath + newCategory._id
      );
      const stock$ = this.fileUploadService.uploadCategoryImage(
        newCategory.stockPhotoFd
      );
      uploadObservables.push(stock$);
    }
    if (uploadObservables.length > 0) {
      return forkJoin(uploadObservables).pipe(
        switchMap((responses: any) => {
          if (responses[0]) {
            category.iconPath = responses[0].categoryImage.path;
          }
          if (responses[1]) {
            category.stockImagePath = responses[1].categoryImage.path;
          }
          return this.categoryService.updateCategory(category._id, category);
        })
      );
    }
    return this.categoryService.updateCategory(category._id, category);
  }

  addNewSubcategory(category: Category, subcategory: Subcategory) {
    category.subcategories.push(subcategory);
    return this.categoryService.updateCategory(category._id, category).pipe(
      tap((categoryResponse) => {
        subcategory._id = categoryResponse.subcategories.find(
          (sub) => sub.name === subcategory.name
        )._id;
        subcategory.iconFd.append(
          "categoryImagePath",
          this.iconPath + category._id + "/" + subcategory._id
        );
        subcategory.stockPhotoFd.append(
          "categoryImagePath",
          this.stockImagePath + category._id + "/" + subcategory._id
        );
      }),
      switchMap(() =>
        this.fileUploadService.uploadCategoryImage(subcategory.iconFd)
      ),
      tap((iconResponse) => {
        subcategory.iconPath = iconResponse.categoryImage.path;
      }),
      switchMap(() =>
        this.fileUploadService.uploadCategoryImage(subcategory.stockPhotoFd)
      ),
      tap(
        (stockImageRes) =>
          (subcategory.stockImagePath = stockImageRes.categoryImage.path)
      ),
      switchMap(() => {
        return this.categoryService.updateCategory(category._id, category);
      })
    );
  }
  updateSubcategory(category: Category, newSubcategory: Subcategory) {
    // need to patch the new properties to the existing subcat as this holds _id, and imagePaths
    let subcategory = category.subcategories.find(
      (sub) => sub._id === newSubcategory._id
    );
    subcategory = this._updateNewValuesInOldObject(subcategory, newSubcategory);
    const uploadObservables = [];
    if (newSubcategory.iconFd) {
      newSubcategory.iconFd.append(
        "categoryImagePath",
        this.iconPath + category._id + "/" + subcategory._id
      );
      const icon$ = this.fileUploadService.uploadCategoryImage(
        newSubcategory.iconFd
      );
      uploadObservables.push(icon$);
    }
    if (newSubcategory.stockPhotoFd) {
      newSubcategory.stockPhotoFd.append(
        "categoryImagePath",
        this.stockImagePath + category._id + "/" + subcategory._id
      );
      const stock$ = this.fileUploadService.uploadCategoryImage(
        newSubcategory.stockPhotoFd
      );
      uploadObservables.push(stock$);
    }
    if (uploadObservables.length > 0) {
      return forkJoin(uploadObservables).pipe(
        switchMap((responses: any) => {
          if (responses[0]) {
            subcategory.iconPath = responses[0].categoryImage.path;
          }
          if (responses[1]) {
            subcategory.stockImagePath = responses[1].categoryImage.path;
          }
          category = this._substituteSubcategory(category, subcategory);
          return this.categoryService.updateCategory(category._id, category);
        })
      );
    } else {
      category = this._substituteSubcategory(category, subcategory);
      return this.categoryService.updateCategory(category._id, category);
    }
  }

  private _substituteSubcategory(
    category: Category,
    subcategory: Subcategory
  ): Category {
    const index = category.subcategories.findIndex(
      (sub) => sub._id === subcategory._id
    );
    if (index !== -1) {
      category.subcategories[index] = subcategory;
    }
    return category;
  }

  private _updateNewValuesInOldObject(oldObject, newObject) {
    Object.keys(newObject).forEach((key) => {
      if (
        oldObject.hasOwnProperty(key) &&
        !this._propertiesToIgnore.includes(key)
      ) {
        oldObject[key] = newObject[key];
      }
    });
    return oldObject;
  }
}
