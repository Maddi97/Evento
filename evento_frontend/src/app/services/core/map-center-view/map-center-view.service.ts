import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MapCenterViewService {
  public mapCenterPosition = new Subject<Array<number>>();
  public isMapViewObservable = new BehaviorSubject<boolean>(false); // Change the type to boolean

  constructor() {}

  setMapViewData(isMapView: boolean): void {
    this.isMapViewObservable.next(isMapView);
  }
  setMapCenter(mapCenter) {
    const mapCenterCorrectedType = [mapCenter.lat, mapCenter.lng];
    this.mapCenterPosition.next(mapCenterCorrectedType);
  }
}
