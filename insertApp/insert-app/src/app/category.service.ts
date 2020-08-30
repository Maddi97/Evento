import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { filter, map, catchError, share } from 'rxjs/operators';
import { Category } from './models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categories: BehaviorSubject<Category[]> = new BehaviorSubject(new Array<Category>());

  constructor(
    private webService: WebService,
    ) { }

    get categories(): Observable<Category[]> {
      return this._categories;
    }


    getCategories(): Observable<Category[]> {
      const obs = this.webService.get('category').pipe(
        map((r: HttpRequest<any>) => r as unknown as Category[]),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then((response) => {
          this._categories.next(response);
        })
        return obs;
    }

    createCategory(cat: Category): Observable<Category> {
      const obs = this.webService.post('/category', cat).pipe(
        map((r: HttpRequest<any>) => r as unknown as Category),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then(
          (response: Category) => {
            console.log(response);
          }
        )
        return obs;
     }
}
