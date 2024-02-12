import { Injectable } from "@angular/core";
import { WebService } from "../../core/web/web.service";
import { catchError, delay, map, share, take, tap } from "rxjs/operators";
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
  constructor(private webService: WebService) {}

  downloadFile(path: string): Observable<Blob> {
    const obs = this.webService.get_file("downloadFile", { path }).pipe(
      map((response) => response as Blob),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      }),
      take(1)
    );
    return obs;
  }
}
