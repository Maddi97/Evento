import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { NominatimGeoService } from "@shared/services/location/nominatim-geo.service";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  searchedCenter = [];

  // Leipzig Center
  defaultCenterPosition = [51.33962, 12.37129];

  // New York Center
  // default_center_position = [40.7142700, -74.0059700]

  constructor(private geoService: NominatimGeoService) {}

  getCurrentPosition() {
    if (this.searchedCenter.length === 2) {
      return this.searchedCenter;
    } else {
      return this.defaultCenterPosition;
    }
  }

  getDefaultLocation() {
    return this.defaultCenterPosition;
  }

  getPositionByInput(addressInput) {
    return this.geoService.getGeoDataAddress(addressInput).then((geoData) => {
      this.searchedCenter = [geoData[0].lat, geoData[0].lon];
    });
  }

  getPositionByLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.searchedCenter = [latitude, longitude];
      });
    });
  }
}
