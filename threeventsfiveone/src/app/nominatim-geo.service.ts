import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, take} from 'rxjs/operators';

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

  get_geo_data(city, street, streetNumber) {
    return this.http.get(this.ROOT_URL + street + '+' + streetNumber + '+,' + city + this.URL_END).pipe(
      take(1),
      map(geo_data => {
        if (Object.keys(geo_data).length < 1)
          throw console.error(("No coordinates found to given adress"));
        return geo_data
      }),
    )
  }

  get_geo_data_address(address) {
    return this.http.get(this.ROOT_URL + address + this.URL_END).pipe(
      take(1),
      map(geo_data => {
        if (Object.keys(geo_data).length < 1) {
          throw console.error(("No coordinates found to given adress"));
        }
        return geo_data
      }),
    )
  }

  get_distance(start_position, end_position) {
    return this.http.get(this.osm_api_url_start + start_position[1] + "," + start_position[0] + ";" + end_position[1] + "," + end_position[0] + this.osm_api_url_end).pipe(
      map( object => {
        return object
      })
    )
  }

}
