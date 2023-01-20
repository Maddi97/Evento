import {Injectable} from '@angular/core';
import {NominatimGeoService} from '../../nominatim-geo.service';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  searchedCenter = [];

  // Leipzig Center
  defaultCenterPosition = [51.33962, 12.37129];

  // New York Center
  // default_center_position = [40.7142700, -74.0059700]

  constructor(
    private geoService: NominatimGeoService,
    private _snackbar: MatSnackBar,
  ) {
  }

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
    return this.geoService.get_geo_data_address(addressInput).pipe(
      map(geoData => {
        this.searchedCenter = [geoData[0].lat, geoData[0].lon];
        sessionStorage.setItem('location', JSON.stringify(this.searchedCenter))
      }));
  }

  watchLocation() {

    return new Observable((observer) => {
      let watchId: number;

      // Simple geolocation API check provides values to publish
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition((position: GeolocationPosition) => {
          const {latitude, longitude} = position.coords;
          this.searchedCenter = [latitude, longitude];
          sessionStorage.setItem('location', JSON.stringify(this.searchedCenter))

          observer.next(position);
        }, (error: GeolocationPositionError) => {
          this.openErrorSnackBar(error.message)
          observer.error('Standort konnte nicht ermittelt werden');
        });
      } else {

        observer.error('Position konnte nicht ermittelt werden');
      }
    });
  }

  getPositionByLocation() {
    return new Observable((observer) => {
      let watchId: number;

      // Simple geolocation API check provides values to publish
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
          const {latitude, longitude} = position.coords;
          this.searchedCenter = [latitude, longitude];
          sessionStorage.setItem('location', JSON.stringify(this.searchedCenter))
          observer.next(position);
        }, (error: GeolocationPositionError) => {
          let message = 'Standort konnte nicht ermittelt werden';
          if (error.code === 1) {
            message = 'Deine Privatspähreeinstellungen verhinderen die Standortermittlung'
          }
          this.openErrorSnackBar(message)
          observer.error(message);
        });
      } else {

        observer.error('Standort konnte nicht ermittelt werden');
      }
    });
  }

  openErrorSnackBar(message) {
    if (message.length < 3) {
      message = 'Standort konnte nicht ermittelt werden'
    }
    this._snackbar.open(message, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar'],

    });
  }
}
