import { Injectable } from "@angular/core";
import { WebService } from "../web/web.service";
import { catchError, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StoreDatasetService {
  constructor(private webService: WebService) {}

  storeLinklistDataset(url, linklist) {
    return this.webService.postDataset("storeLinklist", { url, linklist }).pipe(
      catchError((error) => {
        console.error(
          "Error while storing linklist to dataset occurred:",
          error
        );
        return of({}); // Return an empty object
      })
    );
  }
  storeEventDetailsDataset(events) {
    return this.webService
      .postDataset("storeEventDetails", {
        events: events,
      })
      .pipe(
        catchError((error) => {
          console.error(
            "Error while storing event details to dataset occurred:",
            error
          );
          return of({}); // Return an empty object
        })
      );
  }
}
