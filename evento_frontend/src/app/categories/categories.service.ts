import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError as observableThrowError, throwError } from 'rxjs';
import { WebService } from '../web.service';
import { filter, map, catchError, share, switchMap } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';
import { Organizer } from '../models/organizer';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private webService: WebService,

  ) { }

  getAllCategories(): Observable<Category[]> {
    return this.webService.get('category').pipe(
      map((response: HttpRequest<any>) => response as unknown as Category[]),
      catchError((error: any) => {
        console.error('An error occurred', error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }
}
