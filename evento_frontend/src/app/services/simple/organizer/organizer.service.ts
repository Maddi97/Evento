import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, share } from "rxjs/operators";
import { Organizer } from "../../../globals/models/organizer";
import { WebService } from "../../core/web/web.service";

@Injectable({
  providedIn: "root",
})
export class OrganizerService {
  private cachedFiles: Map<string, Organizer[]> = new Map();

  constructor(private webService: WebService) {}

  getOrganizers(): Observable<Organizer[]> {
    return this.webService.get("organizer").pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      })
    );
  }

  getOrganizerById(organizerId: string): Observable<Organizer[]> {
    if (this.cachedFiles.has(organizerId)) {
      return of(this.cachedFiles.get(organizerId)!);
    }

    return this.webService.get(`organizer/${organizerId}`).pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }

  filterOrganizerByEventsCategory(category: any): Observable<Organizer[]> {
    return this.webService.post("organizerByEventCategory", { category }).pipe(
      map((r: HttpRequest<any>) => r as unknown as Organizer[]),
      catchError((error: any) => {
        console.error("An error occurred", error);
        return throwError(error.error.message || error);
      }),
      share()
    );
  }
}
