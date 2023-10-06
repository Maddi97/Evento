import { Injectable } from '@angular/core';
import { NominatimGeoService } from '../../nominatim-geo.service';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, Observable } from "rxjs";
import { SessionStorageService } from '../session-storage/session-storage.service';
import { addAriaReferencedId } from '@angular/cdk/a11y';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  searchedCenter: Array<Number>;
  disableCallLocation = false;

  // New York Center
  // default_center_position = [40.7142700, -74.0059700]

  constructor(
    private geoService: NominatimGeoService,
    private _snackbar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private sessionStorageService: SessionStorageService
  ) {
  }

  getPositionByInput(addressInput) {
    this.spinner.show()
    this.geoService.get_geo_data_address(addressInput).then(
      (geoData) => {
        const coordinates = [geoData.lat, geoData.lon];
        this.searchedCenter = coordinates;
        this.sessionStorageService.setLocation(coordinates)
      })
      .catch((error) => {
        // Handle the error here
        this.openErrorSnackBar('Adresse konnte nicht gefunden werden.');

        console.error("An error occurred while fetching geo data:", error);
        // You can also show an error message to the user or take other appropriate actions.
      });;
  }

  getPositionByLocation(forcePositionCall = false) {
    this.spinner.show()
    if (this.disableCallLocation || (!forcePositionCall && this.sessionStorageService.getDefaultLocationValue())) { return }
    this.disableCallLocation = true
    // Simple geolocation API check provides values to publish
    // unfortunately needs some seconds sometimes
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        if (latitude && longitude) {
          this.searchedCenter = [latitude, longitude];
          this.sessionStorageService.setLocation(this.searchedCenter)
          console.log("Callback from geo API")
        }
        else {
          this.sessionStorageService.setDefaultLocation()
          this.openErrorSnackBar('Standort konnte nicht ermittelt werden und wird auf Leipzig Zentrum gesetzt.');
        }
      }, (error: GeolocationPositionError) => {
        let message = 'Standort konnte nicht ermittelt werden';
        if (error.code === 1) {
          message = 'Deine Privatspähreeinstellungen verhinderen die Standortermittlung. \nStandort wird zu Leipzig Zentrum gesetzt.'
          this.sessionStorageService.setDefaultLocation()
          this.openErrorSnackBar(message)
        }
      });
    }
    else {
      this.sessionStorageService.setDefaultLocation()
      this.openErrorSnackBar('Standort konnte nicht ermittelt werden und wird auf Leipzig Zentrum gesetzt');
    }
    setTimeout(() => {
      this.disableCallLocation = false;
    }, 5000)

  };

  openErrorSnackBar(message) {
    if (message.length < 3) {
      message = 'Standort konnte nicht ermittelt werden'
    }
    this._snackbar.open(message, '', {
      duration: 1500,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar'],

    });
  }
}
