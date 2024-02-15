import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { WebService } from "../../core/web/web.service";
import { isPlatformServer } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class FileService {
  private fileCache: { [path: string]: string } = {};

  constructor(
    private webService: WebService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  downloadFile(path: string): Observable<string> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }
    if (this.fileCache[path]) {
      return of(this.fileCache[path]);
    }

    const obs = this.webService.downloadFile("downloadFile", { path }).pipe(
      switchMap((response) => this.blobToBase64(response as Blob)),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error?.error?.message || error);
      }),
      tap((response) => (this.fileCache[path] = response)),
      take(1)
    );

    return obs;
  }
  private blobToBase64(blob: Blob): Observable<string> {
    if (isPlatformServer(this.platformId)) {
      return of(null);
    }
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(blob);
    });
  }
}
