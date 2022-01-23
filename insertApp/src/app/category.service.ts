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
      const obs = this.webService.post('category', cat).pipe(
        map((r: HttpRequest<any>) => r as unknown as Category),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then(
          (response: Category) => {
              const tempEvent = this._categories.getValue();
              tempEvent.push(response);
              this._categories.next(tempEvent);
          }
        )
        return obs;
     }
     updateCategory(catId: string, category: Category): Observable<Category>{
      const obs = this.webService.patch(`category/${catId}`, { category }).pipe(
        map((r: HttpRequest<any>) => r as unknown as Category),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
      obs.toPromise().then(
        (response: Category) => {
          const tempCat = this._categories.getValue();
          let indeX: number;
          tempCat.map((cat: Category, index) => {
            if (cat._id === catId) {
              indeX = index;
            }
          });
          tempCat[indeX] = category;
          this._categories.next(tempCat);
        }
      )
      return obs;
     }

     deleteCategory(categoryId: string){
      const obs = this.webService.delete(`category/${categoryId}`).pipe(
        map((r: HttpRequest<any>) => r as unknown as Category),
        catchError((error: any) => {
          console.error('an error occurred', error);
          return observableThrowError(error.error.message || error);
        }),
        share());
        obs.toPromise().then(
          (response: Category) => {
            const tempCat = this._categories.getValue();
            tempCat.map((category: Category, index) => {
              if (category._id === categoryId) {
                tempCat.splice(index, 1);
              }
            });
            this._categories.next(tempCat);
          }
        )
        return obs;
    }
}
