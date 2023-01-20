import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, take} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NominatimGeoService {
  readonly ROOT_URL;
  readonly URL_END;
  readonly osmApiUrlStart;
  readonly osmApiUrlEnd;


  constructor(private http: HttpClient) {
    this.ROOT_URL = 'https://nominatim.openstreetmap.org/search?q=';
    this.URL_END = '&limit=2&format=json';
    this.osmApiUrlStart = 'https://router.project-osrm.org/route/v1/foot/';
    this.osmApiUrlEnd = '.json';
  }

  get_geo_data(city, street, streetNumber) {
    return this.http.get(this.ROOT_URL + street + '+' + streetNumber + '+,' + city + this.URL_END).pipe(
      take(1),
      map(geoData => {
        if (Object.keys(geoData).length < 1) {
          throw console.error(('No coordinates found to given address'));
        }
        return geoData;
      }),
    );
  }

  get_geo_data_address(address) {
    return this.http.get(this.ROOT_URL + address + this.URL_END).pipe(
      take(1),
      map(geoData => {
        if (Object.keys(geoData).length < 1) {
          throw console.error(('No coordinates found to given address'));
        }
        return geoData;
      }),
    );
  }

  get_distance(startPosition, endPosition) {
    const lat1 = startPosition[0];
    const lon1 = startPosition[1];

    const lat2 = endPosition[0];
    const lon2 = endPosition[1];

    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
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
