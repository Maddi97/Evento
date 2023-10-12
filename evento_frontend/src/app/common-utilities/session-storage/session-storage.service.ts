// map-view-storage.service.ts

import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { PositionService } from "../map-view/position.service";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  defaultCenterPosition = [51.33962, 12.37129];

  private mapViewSubject = new Subject<boolean>(); // Change the type to boolean
  private locationSubject = new BehaviorSubject<Array<Number>>(this.getLocationFromStorage());

  constructor(
  ) {
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
  getLocation() {
    return this.locationSubject.asObservable();
  }

  setLocation(location) {
    sessionStorage.setItem('defaultLocation', JSON.stringify(false))
    sessionStorage.setItem('location', JSON.stringify(location));
    this.locationSubject.next(location);
  }

  setDefaultLocation() {
    sessionStorage.setItem('defaultLocation', JSON.stringify(true))
    sessionStorage.setItem('location', JSON.stringify(this.defaultCenterPosition));
    this.locationSubject.next(this.defaultCenterPosition);
  }

  getDefaultLocationValue() {
    const isDefaultLocation = JSON.parse(sessionStorage.getItem('defaultLocation'));
    return isDefaultLocation || false;
  }

  private getLocationFromStorage() {
    const storedLocation = JSON.parse(sessionStorage.getItem('location'));
    return storedLocation || this.defaultCenterPosition;
  }
}
