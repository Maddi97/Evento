import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, of, throwError } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { SnackbarService } from "../utils/snackbar.service";
import { CoordinatesObject } from "@globals/types/location.types";

@Injectable({
  providedIn: "root",
})
export class NominatimGeoService {
  readonly ROOT_URL;
  readonly URL_END;
  readonly osmApiUrlStart;
  readonly osmApiUrlEnd;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.ROOT_URL = "https://nominatim.openstreetmap.org/search?q=";
    this.URL_END = "&limit=2&format=json";
    this.osmApiUrlStart = "https://router.project-osrm.org/route/v1/foot/";
    this.osmApiUrlEnd = ".json";
  }

  async getCoordinates(
    street: string,
    city: string
  ): Promise<CoordinatesObject> {
    try {
      const coordinates$ = this.http
        .get(this.ROOT_URL + street + "+," + city + "&limit=2&format=json", {
          headers: { skip: "true" },
        })
        .pipe(
          map((response: CoordinatesObject) => {
            if (Object.keys(response).length < 1) {
              throw new Error("No coordinates found for the given address");
            }
            return {
              lat: response[0].lat,
              lon: response[0].lon,
            };
          })
        );
      const coordinates: CoordinatesObject = await lastValueFrom(coordinates$);
      console.log(coordinates);
      return coordinates;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  async getGeoDataAddress(address: string): Promise<CoordinatesObject> {
    try {
      const coordinates$ = this.http
        .get(this.ROOT_URL + address + this.URL_END, {
          headers: { skip: "true" },
        })
        .pipe(
          take(1),
          map((response: CoordinatesObject) => {
            if (Object.keys(response).length < 1) {
              throw new Error("No coordinates found for the given address");
            }
            return response;
          }),
          catchError((err) => {
            return throwError(err);
          })
        );

      const coordinates = await lastValueFrom(coordinates$);
      return coordinates;
    } catch (err) {
      throw err; // Rethrow the error for handling at the caller's level
    }
  }

  async getAddressFromCoordinates(coord: CoordinatesObject): Promise<any> {
    try {
      const addres$ = this.http
        .get(
          "https://nominatim.openstreetmap.org/reverse?lat=" +
            coord.lat +
            "&lon=" +
            coord.lon +
            "&limit=2&format=json",
          { headers: { skip: "true" } }
        )
        .pipe(
          take(1),
          map((response: any) => {
            if (Object.keys(response).length < 1) {
              throw new Error("No address found for the given coordinates");
            }
            return response;
          }),
          catchError((err) => {
            this.snackBarService.openSnackBar("Error: " + err, "error");
            return throwError(err);
          })
        );
      const geoData = await lastValueFrom(addres$);
      return geoData;
    } catch (err) {
      throw err; // Rethrow the error for handling at the caller's level
    }
  }
}
