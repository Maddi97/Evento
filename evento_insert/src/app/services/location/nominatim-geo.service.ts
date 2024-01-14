import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, throwError } from "rxjs";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class NominatimGeoService {
  readonly ROOT_URL;
  readonly URL_END;
  readonly osmApiUrlStart;
  readonly osmApiUrlEnd;

  constructor(private http: HttpClient) {
    this.ROOT_URL = "https://nominatim.openstreetmap.org/search?q=";
    this.URL_END = "&limit=2&format=json";
    this.osmApiUrlStart = "https://router.project-osrm.org/route/v1/foot/";
    this.osmApiUrlEnd = ".json";
  }

  get_geo_data(city, street, streetNumber) {
    return this.http
      .get(
        this.ROOT_URL +
          street +
          "+" +
          streetNumber +
          "+," +
          city +
          "&limit=2&format=json",
        { headers: { skip: "true" } }
      )
      .pipe(
        take(1),
        map((geoData) => {
          if (Object.keys(geoData).length < 1) {
            throw new Error("No coordinates found for the given address");
          }
          return {
            lat: geoData[0].lat,
            lon: geoData[0].lon,
          };
        })
      );
  }

  get_geo_data_address(address) {
    return this.http
      .get(this.ROOT_URL + address + this.URL_END, {
        headers: { skip: "true" },
      })
      .pipe(
        take(1),
        map((geoData) => {
          if (Object.keys(geoData).length < 1) {
            return throwError(() => "No coordinates found to given address");
          }
          return geoData;
        })
      );
  }

  get_address_from_coordinates(coord) {
    return this.http
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
        map((geoData) => {
          if (Object.keys(geoData).length < 1) {
            return throwError(() => "No adress found to given coordinates");
          }
          return geoData;
        })
      );
  }
}
