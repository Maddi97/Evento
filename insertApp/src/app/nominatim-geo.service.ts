import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError, BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { HttpRequest } from '@angular/common/http';
import { filter, map, catchError, share, take } from 'rxjs/operators';
import { Event } from './models/event';
@Injectable({
  providedIn: 'root'
})
export class NominatimGeoService {
  readonly ROOT_URL;
    readonly URL_END;
    readonly osm_api_url_start;
    readonly osm_api_url_end;

  constructor(private http: HttpClient) {
        this.ROOT_URL = "https://nominatim.openstreetmap.org/search?q=";
          this.URL_END = '&limit=2&format=json'
          this.osm_api_url_start = "https://router.project-osrm.org/route/v1/foot/"
          this.osm_api_url_end = ".json"
   }

  get_geo_data(city, street, streetNumber){

         return this.http.get( this.ROOT_URL + street + '+' + streetNumber + '+,' + city + '&limit=2&format=json' ).pipe(
          take(1),
          map(geo_data => {
                  if(Object.keys(geo_data).length < 1)
                    throw console.error(("No coordinates found to given address"));
                  return geo_data
                }),
                )
  }

    get_geo_data_address(address) {
        return this.http.get(this.ROOT_URL + address + this.URL_END).pipe(
            take(1),
            map(geo_data => {
                if (Object.keys(geo_data).length < 1) {
                    throw console.error(("No coordinates found to given address"));
                }
                return geo_data
            }),
        )
    }
  get_address_from_coordinates(coord){
      return this.http.get('https://nominatim.openstreetmap.org/reverse?lat=' + coord.lat + '&lon=' + coord.lon + '&limit=2&format=json').pipe(
          take(1),
          map(geo_data => {
              if(Object.keys(geo_data).length < 1)
                  throw console.error(("No coordinates found to given address"));
              return geo_data
          }),
      )
  }

}
