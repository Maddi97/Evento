import {Injectable} from "@angular/core";
import {NominatimGeoService} from "../nominatim-geo.service";
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    searched_center = []

    // Leipzig Center
    default_center_position = [51.33962, 12.37129]

    // New York Center
    //default_center_position = [40.7142700, -74.0059700]

    constructor(
        private geoService: NominatimGeoService
    ) {
    }

    getCurrentPosition() {
        if (this.searched_center.length === 2) {
            return this.searched_center
        } else {
            return this.default_center_position
        }
    }

    getDefaultLocation() {
        return this.default_center_position
    }

    getPositionByInput(address_input) {
        return this.geoService.get_geo_data_address(address_input).pipe(
            map(geo_data => {
                this.searched_center = [geo_data[0].lat, geo_data[0].lon]
            }))
    }

    getPositionByLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const {latitude, longitude} = position.coords;
                    this.searched_center = [latitude, longitude];
                    resolve()
                });
        })
    }

}
