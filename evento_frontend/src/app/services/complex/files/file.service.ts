import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { WebService } from "../../core/web/web.service";

@Injectable({
  providedIn: "root",
})
export class FileService {
  private fileCache: { [path: string]: Blob } = {};

  constructor(private webService: WebService) {}

  downloadFile(path: string): Observable<Blob> {
    if (this.fileCache[path]) {
      console.log("File retrieved from cache");
      return of(this.fileCache[path]);
    }

    const obs = this.webService.get_file("downloadFile", { path }).pipe(
      map((response) => response as Blob),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      }),
      take(1)
    );

    obs.subscribe((blob) => {
      this.fileCache[path] = blob;
    });

    return obs;
  }
}
