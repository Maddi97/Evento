import { isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DEFAULT_LOCATION } from "@globals/constants/position";
import { CoordinatesArray } from "@globals/types/location.types";
import { GeolocationService } from "@ng-web-apis/geolocation";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject, map, take, timeout } from "rxjs";
import { NominatimGeoService } from "./nominatim-geo.service";
import { CookiesService } from "../cookie-service/cookies.service";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  searchedCenter: Array<number>;
  disableCallLocation = false;
  private cookieKey = "position";
  private cookieExpireHours = 6;

  public positionObservable: BehaviorSubject<CoordinatesArray>;
  public isPositionDefault: BehaviorSubject<boolean>;

  timeout = 8000;
  constructor(
    private geoService: NominatimGeoService,
    private _snackbar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private readonly cookieService: CookiesService,
    private readonly geolocation$: GeolocationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(platformId)) {
      this.positionObservable.next(DEFAULT_LOCATION);
    }

    const postionFromCookie = this.cookieService.getCookie(this.cookieKey)
      ? JSON.parse(this.cookieService.getCookie(this.cookieKey))
      : null;

    this.positionObservable = new BehaviorSubject<CoordinatesArray>(
      postionFromCookie || DEFAULT_LOCATION
    );

    this.isPositionDefault = new BehaviorSubject<boolean>(!postionFromCookie);
  }

  getPositionByInput(addressInput) {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.spinner.show();
    this.closeSpinnerAfterTimeout();
    this.geoService
      .get_geo_data_address(addressInput)
      .then((coordinatesObject) => {
        const coordinates: CoordinatesArray = [
          coordinatesObject.lat,
          coordinatesObject.lon,
        ];
        this.searchedCenter = coordinates;
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
    if (isPlatformServer(this.platformId)) {
      return;
    }
    if (showSpinner) this.spinner.show();
    this.geolocation$
      .pipe(
        take(1),
        timeout(this.timeout),
        map((position) => [position.coords.latitude, position.coords.longitude])
      )
      .subscribe({
        next: (position: CoordinatesArray) => {
          console.log("Position requested: ", position);
          this.cookieService.setCookie(
            this.cookieKey,
            JSON.stringify(position),
            this.cookieExpireHours
          );
          this.positionObservable.next(position),
            this.isPositionDefault.next(false);
        },
        error: (error) => {
          this.setDefaultLocation();
          if (error.name === "TimeoutError") {
            // Handle timeout error
            this.openErrorSnackBar(
              "Timeout beim finden der Position.\nStandort wird zu Leipzig Zentrum gesetzt."
            );
          }
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
    if (isPlatformServer(this.platformId)) {
      return;
    }
    setTimeout(() => {
      this.spinner.hide();
    }, this.timeout);
  }
}
