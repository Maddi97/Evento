// map-view-storage.service.ts

import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  private mapViewSubject = new Subject<boolean>(); // Change the type to boolean

  constructor() {
    const initialMapViewData = this.getMapViewData();
    if (initialMapViewData === null) {
      this.setMapViewData(false); // Set the default value here as a boolean
    }

    window.addEventListener("storage", (event: StorageEvent) => {
      if (event.key === "mapViewData") {
        this.mapViewSubject.next(JSON.parse(event.newValue)); // Parse the string to a boolean
      }
    });
  }

  setMapViewData(data: boolean): void {
    // Change the parameter type to boolean
    sessionStorage.setItem("mapViewData", JSON.stringify(data)); // Convert boolean to string
    this.mapViewSubject.next(data);
  }

  getMapViewData(): boolean | null {
    // Change the return type to boolean
    const value = sessionStorage.getItem("mapViewData");
    return value !== null ? JSON.parse(value) : null; // Parse the string to a boolean
  }

  mapViewChanges(): Observable<boolean> {
    // Change the return type to boolean
    return this.mapViewSubject.asObservable();
  }
}
