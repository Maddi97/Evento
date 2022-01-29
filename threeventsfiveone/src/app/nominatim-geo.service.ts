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
      map(geoData => {
        if (Object.keys(geoData).length < 1)
          throw console.error(("No coordinates found to given address"));
        return geoData;
      }),
    )
  }

  get_geo_data_address(address) {
    return this.http.get(this.ROOT_URL + address + this.URL_END).pipe(
      take(1),
      map(geoData => {
        if (Object.keys(geoData).length < 1) {
          throw console.error(("No coordinates found to given address"));
        }
        return geoData
      }),
    )
  }

  get_distance(start_position, end_position) {
    let lat1 = start_position[0]
    let lon1 = start_position[1]

    let lat2 = end_position[0]
    let lon2 = end_position[1]

    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344;
      return dist;
    }
  }

}
