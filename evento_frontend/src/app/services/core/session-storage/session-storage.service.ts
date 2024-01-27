// map-view-storage.service.ts

import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  public isAppStoreBannerClosedSubject = new Subject<boolean>();
  private locationSubject;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
    }
  }

  getLocation() {
    if (isPlatformBrowser(this.platformId)) {
      return this.locationSubject.asObservable();
    }
  }

  setLocation(location) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem("defaultLocation", JSON.stringify(false));
      if (
        JSON.stringify(location) !==
        JSON.stringify(sessionStorage.getItem("location"))
      ) {
        sessionStorage.setItem("location", JSON.stringify(location));
        this.locationSubject.next(location);
      }
    }
  }

  getDefaultLocationValue() {
    if (isPlatformBrowser(this.platformId)) {
      const isDefaultLocation = JSON.parse(
        sessionStorage.getItem("defaultLocation")
      );
      return isDefaultLocation || false;
    } else return false;
  }

  getUserLocationFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(sessionStorage.getItem("location")) || undefined;
    }
    return undefined;
  }

  removePositionFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem("location");
      sessionStorage.removeItem("defaultLocation");
    }
  }

  getAppStoreBannerClosedStatus() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(sessionStorage.getItem("isAppStoreBannerClosed"));
    }
    return true;
  }
  setAppStoreBannerClosedStatus(isClosed: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(
        "isAppStoreBannerClosed",
        JSON.stringify(isClosed)
      );
      this.isAppStoreBannerClosedSubject.next(isClosed);
    }
  }
}
