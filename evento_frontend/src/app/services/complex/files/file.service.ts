import { Injectable } from "@angular/core";
import { WebService } from "../../core/web/web.service";
import { catchError, delay, map, share, tap } from "rxjs/operators";
import {
  Observable,
  throwError as observableThrowError,
  BehaviorSubject,
  of,
  throwError,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileService {
  private cachedFiles: Map<string, Blob> = new Map();

  constructor(private webService: WebService) {}

  downloadFile(path: string): Observable<Blob> {
    if (this.cachedFiles.has(path)) {
      return of(this.cachedFiles.get(path)!);
    }

    const obs = this.webService.get_file("downloadFile", { path }).pipe(
      map((response) => response as unknown as Blob),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      }),
      tap((blob) => {
        this.cachedFiles.set(path, blob);
      }),
      share()
    );
    return obs;
  }
}
