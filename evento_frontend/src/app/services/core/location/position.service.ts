import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DEFAULT_LOCATION } from "@globals/constants/position";
import { GeolocationService } from "@ng-web-apis/geolocation";
import { NgxSpinnerService } from "ngx-spinner";
import {
  BehaviorSubject,
  ReplaySubject,
  Subject,
  filter,
  map,
  take,
  tap,
} from "rxjs";
import { NominatimGeoService } from "./nominatim-geo.service";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  searchedCenter: Array<number>;
  disableCallLocation = false;
  public positionObservable = new ReplaySubject<Array<number>>(1);
  public isPositionDefault = new BehaviorSubject<Boolean>(true);
  // New York Center
  // default_center_position = [40.7142700, -74.0059700]

  constructor(
    private geoService: NominatimGeoService,
    private _snackbar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private readonly geolocation$: GeolocationService
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

  getGeoLocation(showSpinner = false) {
    if (showSpinner) this.spinner.show();
    this.geolocation$
      .pipe(
        take(1),
        map((position) => [position.coords.latitude, position.coords.longitude])
      )
      .subscribe({
        next: (position) => {
          console.log("Position requested: ", position);
          this.positionObservable.next(position),
            this.isPositionDefault.next(false);
        },
        error: (error) => {
          this.setDefaultLocation();
          if (error.code === 1) {
            this.openErrorSnackBar(
              "Deine Privatspähreeinstellungen verhinderen die Standortermittlung.\nStandort wird zu Leipzig Zentrum gesetzt."
            );
          } else {
            this.openErrorSnackBar(
              "Standort konnte nicht ermittelt werden und wird auf Leipzig Zentrum gesetzt."
            );
          }
        },
      });
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
