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


  constructor(private http: HttpClient) {
        this.ROOT_URL = "https://nominatim.openstreetmap.org/search?q=";
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
