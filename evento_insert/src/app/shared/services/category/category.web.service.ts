import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  throwError as observableThrowError,
} from "rxjs";
import { catchError, map, share } from "rxjs/operators";
import { Category } from "../../../globals/models/category";
import { WebService } from "../web/web.service";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private webService: WebService) {}

  getCategories(): Observable<Category[]> {
    const obs = this.webService.get("category").pipe(
      map((r) => r as unknown as Category[]),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return observableThrowError(error.error.message || error);
      }),
      share()
    );
    return obs;
  }

  createCategory(cat: Category): Observable<Category> {
    const obs = this.webService.post("category", cat).pipe(
      map((r) => r as unknown as Category),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return observableThrowError(error.error.message || error);
      }),
      share()
    );
    return obs;
  }

  updateCategory(catId: string, category: Category): Observable<Category> {
    const obs = this.webService.patch(`category/${catId}`, { category }).pipe(
      map((r) => r as unknown as Category),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return observableThrowError(error.message || error);
      }),
      share()
    );

    return obs;
  }

  deleteCategory(categoryId: string) {
    console.log(categoryId);
    const obs = this.webService.delete(`category/${categoryId}`).pipe(
      map((r) => r as unknown as Category),
      catchError((error: any) => {
        console.error("an error occurred", error);
        return observableThrowError(error.error.message || error);
      }),
      share()
    );
    return obs;
  }
}
