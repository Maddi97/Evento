import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, share } from "rxjs/operators";
import { Category } from "../../../globals/models/category";
import { CategoriesService } from "../../simple/categories/categories.service";
import { WebService } from "../../core/web/web.service";

@Injectable({
  providedIn: "root",
})
export class CategoriesComplexService {
  constructor(private categoriesService: CategoriesService) {}

  public getCategoriesSortedByWeight(): Observable<Category[]> {
    const categories$ = this.categoriesService
      .getAllCategories()
      .pipe(map((categories) => this.sortCategoriesByWeight(categories)));
    return categories$;
  }
  private sortCategoriesByWeight(categoryList) {
    return categoryList.sort((a, b) => {
      const weightA = a.weight ? parseFloat(a.weight) : 0;
      const weightB = b.weight ? parseFloat(b.weight) : 0;
      return weightB - weightA;
    });
  }
}
