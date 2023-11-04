import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as log from 'loglevel';
import { BehaviorSubject, Observable, throwError as observableThrowError, of } from 'rxjs';
import { catchError, map, share, shareReplay } from 'rxjs/operators';
import { WebService } from '../web.service';

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

    uploadEventImage(im: any): Observable<any> {
        const obs = this.webService.post('uploadEventImage', im).pipe(
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


    uploadOrganizerImage(im: any): Observable<any> {
        return this.webService.post('uploadOrganizerImage', im).pipe(
            map((r: HttpRequest<any>) => r as unknown as any),
            catchError((error: any) => {
                console.error('an error occurred', error);
                return observableThrowError(error.error.message || error);
            }),
            share());
    }

    downloadFile(path: string): Observable<Blob> {
        const obs = this.webService.get_file('downloadFile', { path }).pipe(
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

    deleteFile(path: string): Observable<any> {
        const deleteEndpoint = `deleteImage`; // Update this with the actual endpoint URL

        // Send a DELETE request to delete the file
        return this.webService.post(deleteEndpoint, { path: path })
            .pipe(
                map(response => { return response }),
                catchError((error: any) => {
                    // Handle the error here, log it, etc.
                    console.error('Error deleting file:', error);
                    return of(false);
                })
            );
    }
}
