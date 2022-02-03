import { Injectable } from '@angular/core';
import {WebService} from './web.service';
import {catchError, map, share} from 'rxjs/operators';
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private _files: BehaviorSubject<any[]> = new BehaviorSubject(new Array<any>());

  constructor(    private webService: WebService
  ) { }

  downloadFile(path: string): Observable<Blob> {
    const obs = this.webService.get_file('downloadFile', {path}).pipe(
      map((r) => r as unknown as any),
      catchError((error: any) => {
        console.error('an error occurred', error);
        return observableThrowError(error.error.message || error);
      }),
      share());
    obs.toPromise().then(
      (response: any) => {
      }
    );
    return obs;
  }

}
