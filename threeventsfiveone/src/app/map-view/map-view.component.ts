import {AfterViewInit, Component, OnChanges, OnInit, Input} from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnChanges {
  @Input() marker_data = [];
  private map;
  private markerGroup
  private iconDefault

  constructor() {
  }

  ngOnInit(): void {
    const iconRetinaUrl = './assets/marker-icon-2x.png';
    const iconUrl = './assets/marker-icon.png';
    const shadowUrl = './assets/marker-shadow.png';
    this.iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [16, 24],
      iconAnchor: [8, 30],
      popupAnchor: [1, -26],
      tooltipAnchor: [10, -20],
      shadowSize: [30, 30]
    });

    L.Marker.prototype.options.icon = this.iconDefault;
  }

  ngOnChanges(): void {
    if (typeof this.map == 'undefined') {
      this.initMap()
    }
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.setMarkers(this.marker_data)
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [51.33962, 12.37129],
      zoom: 11
    });

    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  private setMarkers(marker_data): void {
    this.markerGroup.clearLayers();
    if (typeof marker_data != 'undefined') {
      marker_data.map(marker => {
        if (typeof marker.geo_data != 'undefined') {
          L.marker([marker.geo_data.lat, marker.geo_data.lon], this.iconDefault)
            .addTo(this.markerGroup)
        }
      })
    }
  }
}


// https://nominatim.openstreetmap.org/search?q=Philipp-Rosenthal-Straße+31,Leipzig&limit=2&format=json
