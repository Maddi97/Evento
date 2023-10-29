import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Geolocation } from '@capacitor/geolocation';
import { NgxSpinnerService } from 'ngx-spinner';
import { NominatimGeoService } from '../../nominatim-geo.service';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  searchedCenter: Array<number>;
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
    this.closeSpinnerAfterTimeout()
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

  async getPositionByLocation(forcePositionCall = false) {
    this.spinner.show()
    this.closeSpinnerAfterTimeout()
    if (this.disableCallLocation || (!forcePositionCall && this.sessionStorageService.getDefaultLocationValue())) {
      this.spinner.hide()
      return
    }
    this.disableCallLocation = true
    // Simple geolocation API check provides values to publish
    // unfortunately needs some seconds sometimes
    Geolocation.getCurrentPosition().then((position: GeolocationPosition) => {
      console.log(position.coords)
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
    }).catch((error: GeolocationPositionError) => {
      let message = 'Standort konnte nicht ermittelt werden';
      this.spinner.hide()
      console.log(error)
      if (error.code === 1) {
        message = 'Deine Privatspähreeinstellungen verhinderen die Standortermittlung. \nStandort wird zu Leipzig Zentrum gesetzt.'
        this.sessionStorageService.setDefaultLocation()
        this.openErrorSnackBar(message)
      }
      else {
        this.sessionStorageService.setDefaultLocation()
        this.openErrorSnackBar(message)
      }
    });
    setTimeout(() => {
      this.disableCallLocation = false;
    }, 3000)

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
  closeSpinnerAfterTimeout() {
    setTimeout(() => {
      this.spinner.hide()
    }, 8000)
  }
}
