import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {
  private map;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap()
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

tiles.addTo(this.map);
  }
private initMap(): void {
  this.map = L.map('map', {
    center: [ 51.3276292
, 12.3902984 ],
    zoom: 16
  });
}
}

// https://nominatim.openstreetmap.org/search?q=Philipp-Rosenthal-Straße+31,Leipzig&limit=2&format=json