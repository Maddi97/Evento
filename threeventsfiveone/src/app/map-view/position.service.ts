import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {NominatimGeoService} from "../nominatim-geo.service";
import {map} from 'rxjs/operators';
import {resolve} from "@angular/compiler-cli/src/ngtsc/file_system";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private _position: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([])

  searched_center = []

  // Leipzig Center
  default_center_position = [51.33962, 12.37129]

  // New York Center
  //default_center_position = [40.7142700, -74.0059700]

  constructor(
    private geoService: NominatimGeoService
  ) {
  }

  get position(): Observable<Array<any>> {
    return this._position
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
    // ToDO -> see map-view.component.ts
  }

}
