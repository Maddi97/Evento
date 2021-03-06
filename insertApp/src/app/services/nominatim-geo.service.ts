import {Injectable} from '@angular/core';
import {Observable, throwError as observableThrowError, BehaviorSubject, throwError, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HttpRequest} from '@angular/common/http';
import {filter, map, catchError, share, take} from 'rxjs/operators';
import {Event} from '../models/event';

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
        this.URL_END = '&limit=2&format=json'
        this.osmApiUrlStart = 'https://router.project-osrm.org/route/v1/foot/'
        this.osmApiUrlEnd = '.json'
    }

    get_geo_data(city, street, streetNumber) {

        return this.http.get(this.ROOT_URL + street + '+' + streetNumber + '+,' + city + '&limit=2&format=json').pipe(
            take(1),
        )
    }

    get_geo_data_address(address) {
        return this.http.get(this.ROOT_URL + address + this.URL_END).pipe(
            take(1),
            map(geoData => {
                if (Object.keys(geoData).length < 1) {
                    return throwError(() => ('No coordinates found to given address'));
                }
                return geoData
            }),
        )
    }

    get_address_from_coordinates(coord) {
        return this.http.get('https://nominatim.openstreetmap.org/reverse?lat='
            + coord.lat + '&lon=' + coord.lon + '&limit=2&format=json').pipe(
            take(1),
            map(geoData => {
                if (Object.keys(geoData).length < 1) {
                    return throwError(() => ('No adress found to given coordinates'));
                }
                return geoData
            }),
        )
    }

}
