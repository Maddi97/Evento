import {Injectable} from '@angular/core';
import {WebService} from './web.service';
import {Observable, throwError as observableThrowError, BehaviorSubject} from 'rxjs';
import {HttpRequest} from '@angular/common/http';
import {filter, map, catchError, share, shareReplay} from 'rxjs/operators';
import * as log from 'loglevel';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    private _files: BehaviorSubject<any[]> = new BehaviorSubject(new Array<any>());

    constructor(
        private webService: WebService
    ) {
    }

    get categories(): Observable<any[]> {
        return this._files;
    }

    uploadCategoryFiles(im: any): Observable<any> {
        const obs = this.webService.post('uploadCategoryFiles', im).pipe(
            map((r: HttpRequest<any>) => r as unknown as any),
            catchError((error: any) => {
                console.error('an error occurred', error);
                return observableThrowError(error.error.message || error);
            }),
            share());
        obs.toPromise().then(
            (response: any) => {
                log.debug(response);
            }
        )
        return obs;
    }

    downloadFile(path: string): Observable<Blob> {
        const obs = this.webService.get_file('downloadFile', {path}).pipe(
            map((r) => r as unknown as any),
            catchError((error: any) => {
                console.error('an error occurred', error);
                return observableThrowError(error.error.message || error);
            }),
            shareReplay(1),
            share());
        obs.toPromise().then(
            (response: any) => {
            }
        )
        return obs;
    }
}
