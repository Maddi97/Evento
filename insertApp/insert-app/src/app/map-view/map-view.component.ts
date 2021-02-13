import { AfterViewInit, Component, OnChanges,OnInit, Input } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnChanges {
  @Input() marker_data = []
  private map;
  
  icon = {
      icon: L.icon({
        iconSize: [ 12, 21 ],
        iconAnchor: [ 6, 21 ],
        iconUrl: './marker-icon.png',
        shadowSize: [ 12, 21 ],
        shadowAnchor: [ 6, 21 ],
        shadowUrl: './marker-shadow.png'
      })
    };

  constructor() { }

  ngOnInit(): void {
    if(typeof this.map != 'undefined') 
    {
      this.map.remove()
    }
    this.initMap()
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 20,
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    });
  tiles.addTo(this.map);
  }

  ngOnChanges(): void {
    if(typeof this.map != 'undefined') 
    {
      this.map.remove()
    }
      this.initMap()
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 20,
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    });
  tiles.addTo(this.map);

  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 51.33962, 12.37129 ],
      zoom: 11
    });
      this.setMarkers(this.marker_data)
  }

  private setMarkers(marker_data) : void {
    if(typeof marker_data != 'undefined')
    {
      marker_data.map(marker => 
      {
        if(typeof marker.geo_data != 'undefined')
         { 
           L.marker([marker.geo_data.lat, marker.geo_data.lon], this.icon)
          .addTo(this.map)
          .bindPopup("<b>Hello world!</b><br>I am a popup.");
        }
      })
    }

}

}



// https://nominatim.openstreetmap.org/search?q=Philipp-Rosenthal-Straße+31,Leipzig&limit=2&format=json