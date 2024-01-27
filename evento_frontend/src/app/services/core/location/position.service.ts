import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Geolocation } from "@capacitor/geolocation";
import { NgxSpinnerService } from "ngx-spinner";
import { NominatimGeoService } from "./nominatim-geo.service";
import { SessionStorageService } from "@services/core/session-storage/session-storage.service";
import { BehaviorSubject, Subject, of } from "rxjs";
import { DEFAULT_LOCATION } from "@globals/constants/position";
import { isPlatformBrowser } from "@angular/common";
@Injectable({
  providedIn: "root",
})
export class PositionService {
  searchedCenter: Array<number>;
  disableCallLocation = false;

  public positionObservable = new BehaviorSubject<Array<number>>(
    DEFAULT_LOCATION
  );
  public isPositionDefault = new BehaviorSubject<Boolean>(true);
  // New York Center
  // default_center_position = [40.7142700, -74.0059700]

  constructor(
    private geoService: NominatimGeoService,
    private _snackbar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getPositionByInput(addressInput) {
    this.spinner.show();
    this.closeSpinnerAfterTimeout();
    this.geoService
      .get_geo_data_address(addressInput)
      .then((geoData) => {
        const coordinates = [geoData.lat, geoData.lon];
        this.searchedCenter = coordinates;
        console.log("location from input");
        this.positionObservable.next(coordinates);
        this.isPositionDefault.next(false);
      })
      .catch((error) => {
        // Handle the error here
        this.openErrorSnackBar("Adresse konnte nicht gefunden werden.");

        console.error("An error occurred while fetching geo data:", error);
        // You can also show an error message to the user or take other appropriate actions.
      });
  }

  async getPositionByLocation(forcePositionCall = false) {
    if (isPlatformBrowser(this.platformId)) {
      let positionReturned = false;
      this.spinner.show();
      this.closeSpinnerAfterTimeout();
      if (this.disableCallLocation || !forcePositionCall) {
        return Promise.resolve("failed");
      }
      setTimeout(() => {
        if (!positionReturned) {
          this.setDefaultLocation();
          Promise.resolve("Timeout");
        }
      }, 8000);
      this.disableCallLocation = true;
      // Simple geolocation API check provides values to publish
      // unfortunately needs some seconds sometimes
      await Geolocation.getCurrentPosition()
        .then((position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          if (latitude && longitude) {
            this.searchedCenter = [latitude, longitude];
            this.positionObservable.next(this.searchedCenter);
            this.isPositionDefault.next(false);
            positionReturned = true;
            console.log("Callback from geo API");
          } else {
            this.setDefaultLocation();
            this.openErrorSnackBar(
              "Standort konnte nicht ermittelt werden und wird auf Leipzig Zentrum gesetzt."
            );
            positionReturned = true;
            return Promise.resolve("failed");
          }
        })
        .catch((error: GeolocationPositionError) => {
          let message = "Standort konnte nicht ermittelt werden";
          this.spinner.hide();
          if (error.code === 1) {
            message =
              "Deine Privatspähreeinstellungen verhinderen die Standortermittlung. \nStandort wird zu Leipzig Zentrum gesetzt.";
            this.setDefaultLocation();
            positionReturned = true;
            this.openErrorSnackBar(message);
          } else {
            this.setDefaultLocation();
            positionReturned = true;
            this.openErrorSnackBar(message);
          }
        });

      setTimeout(() => {
        this.disableCallLocation = false;
      }, 3000);
      return Promise.resolve("completed");
    }
  }

  setDefaultLocation() {
    this.isPositionDefault.next(true);
    this.positionObservable.next(DEFAULT_LOCATION);
  }

  openErrorSnackBar(message) {
    if (message.length < 3) {
      message = "Standort konnte nicht ermittelt werden";
    }
    this._snackbar.open(message, "", {
      duration: 1500,
      verticalPosition: "bottom",
      horizontalPosition: "center",
      panelClass: ["red-snackbar"],
    });
  }
  closeSpinnerAfterTimeout() {
    setTimeout(() => {
      this.spinner.hide();
    }, 8000);
  }
}
