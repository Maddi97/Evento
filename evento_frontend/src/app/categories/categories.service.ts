import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { WebService } from '../web.service';
import { filter, map, catchError, share, switchMap } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';
import { Organizer } from '../models/organizer';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private _categories: BehaviorSubject<Category[]> = new BehaviorSubject(new Array<Category>());

  constructor(
    private webService: WebService,

  ) { }

  get categories(): Observable<Category[]> {
    return this._categories;
  }

  getAllCategories() {
    const obs = this.webService.get('category').pipe(
      map((r: HttpRequest<any>) => r as unknown as Category[]),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then((r) => {
      const tempCat = this._categories.getValue();
      r.forEach(cat => {
        if (!tempCat.map(m => m._id).includes(cat._id)) {
          tempCat.push(cat);
        }
      });
      this._categories.next(tempCat);
    });
  }
}
