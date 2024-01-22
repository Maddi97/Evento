// map-view-storage.service.ts

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, map } from "rxjs";

export type Search = {
  searchString: string;
  event: "Input" | "Reset";
};
@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  defaultCenterPosition = [51.33962, 12.37129];

  public searchNewCenterSubject = new Subject<Array<number>>();
  public draggedMapCenterSubject = new Subject<Array<number>>();
  public searchStringSubject = new Subject<Search>();
  private mapViewSubject = new Subject<boolean>(); // Change the type to boolean
  private locationSubject = new BehaviorSubject<Array<number>>(
    this.getLocationFromStorage()
  );

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
  getLocation() {
    return this.locationSubject.asObservable();
  }

  setLocation(location) {
    sessionStorage.setItem("defaultLocation", JSON.stringify(false));
    if (
      JSON.stringify(location) !==
      JSON.stringify(sessionStorage.getItem("location"))
    ) {
      console.log("Set", location);
      sessionStorage.setItem("location", JSON.stringify(location));
      this.locationSubject.next(location);
    }
  }

  setDefaultLocation() {
    sessionStorage.setItem("defaultLocation", JSON.stringify(true));
    sessionStorage.setItem(
      "location",
      JSON.stringify(this.defaultCenterPosition)
    );
    this.locationSubject.next(this.defaultCenterPosition);
  }

  getDefaultLocationValue() {
    const isDefaultLocation = JSON.parse(
      sessionStorage.getItem("defaultLocation")
    );
    return isDefaultLocation || false;
  }

  private getLocationFromStorage() {
    const storedLocation = JSON.parse(sessionStorage.getItem("location"));
    return storedLocation || this.defaultCenterPosition;
  }

  getUserLocationFromStorage() {
    return JSON.parse(sessionStorage.getItem("location")) || undefined;
  }

  removePositionFromStorage() {
    sessionStorage.removeItem("location");
    sessionStorage.removeItem("defaultLocation");
  }

  setMapCenter(mapCenter) {
    const mapCenterCorrectedType = [mapCenter.lat, mapCenter.lng];
    sessionStorage.setItem("mapCenter", JSON.stringify(mapCenterCorrectedType));
    this.draggedMapCenterSubject.next(mapCenter);
  }
  emitSearchOnNewCenter() {
    this.searchNewCenterSubject.next(
      JSON.parse(sessionStorage.getItem("mapCenter"))
    );
  }

  setSearchString(search: Search) {
    sessionStorage.setItem("searchString", JSON.stringify(search));
    console.log(JSON.parse(sessionStorage.getItem("searchString")));
    this.searchStringSubject.next(search);
  }
  clearSearchFilter() {
    const emptySearch: Search = {
      searchString: "",
      event: "Reset",
    };
    if (
      emptySearch.searchString !==
      JSON.parse(sessionStorage.getItem("searchString"))
    ) {
      sessionStorage.setItem("searchString", JSON.stringify(""));
      this.searchStringSubject.next(emptySearch);
    }
  }
}
