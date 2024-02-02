import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, share } from "rxjs/operators";
import { Category } from "../../../globals/models/category";
import { WebService } from "../../core/web/web.service";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  constructor(private webService: WebService) {}

  getAllCategories(): Observable<Category[]> {
    return this.webService.get("category").pipe(
      map((response: HttpRequest<any>) => response as unknown as Category[]),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }
}
