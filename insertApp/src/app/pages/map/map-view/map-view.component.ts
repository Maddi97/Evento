import {Component, OnChanges, OnInit, Input} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from './position.service';

@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnChanges {
    @Input() markerData = [];
    private map;
    private markerGroup
    private positionMarkerGroup
    address = ''

    currentPosition = {
        lat: '',
        lon: ''
    }

    private defaultIconRetina = './assets/leaflet_color_markers/marker-icon-2x-blue.png';
    private defaultIcon = './assets/leaflet_color_markers/marker-icon-blue.png';
    private shadowUrl = './assets/leaflet_color_markers/marker-shadow.png';

    private locationIcon = './assets/leaflet_color_markers/marker-icon-red.png';
    private locationIconRetina = './assets/leaflet_color_markers/marker-icon-2x-red.png';

    private LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: this.shadowUrl,
            iconSize: [16, 24],
            iconAnchor: [8, 30],
            popupAnchor: [1, -26],
            tooltipAnchor: [10, -20],
            shadowSize: [30, 30]
        }
    });

    constructor(
        private positionService: PositionService,
    ) {
    }


    ngOnInit(): void {
        this.updatePosition(this.positionService.getDefaultLocation())
    }


    updatePosition(locationList) {
        this.currentPosition.lat = locationList[0]
        this.currentPosition.lon = locationList[1]
    }

    resetCenter() {
        this.updatePosition(this.positionService.getCurrentPosition())
        this.setPositionMarker()
        this.map.panTo((new L.LatLng(this.currentPosition.lat, this.currentPosition.lon)))
    }


    ngOnChanges(): void {
        if (typeof this.map === 'undefined') {
            this.initMap()
        }
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);

        this.setPositionMarker()
        this.setMarkers(this.markerData)
    }

    private initMap(): void {
        if (this.currentPosition.lat === '' || this.currentPosition.lon === '') {
            this.updatePosition(this.positionService.getCurrentPosition())
        }

        if (document.getElementById('map').className === '') {
            this.map = L.map('map', {
                center: [this.currentPosition.lat, this.currentPosition.lon],
                zoom: 11
            });
        } else {
            document.getElementById('map').remove()
            this.map = L.map('map', {
                center: [this.currentPosition.lat, this.currentPosition.lon],
                zoom: 11
            });

        }

        this.positionMarkerGroup = L.layerGroup().addTo(this.map);
        this.markerGroup = L.layerGroup().addTo(this.map);
    }

    private setPositionMarker(): void {
        this.positionMarkerGroup.clearLayers();
        L.marker([this.currentPosition.lat, this.currentPosition.lon])
            .setIcon(new this.LeafIcon({iconUrl: this.locationIcon, iconRetinaUrl: this.locationIconRetina}))
            .addTo(this.positionMarkerGroup);
    }

    private setMarkers(markerData): void {
        this.markerGroup.clearLayers();
        if (typeof markerData !== 'undefined') {
            markerData.map(marker => {
                if (typeof marker.geoData !== 'undefined') {
                    L.marker([marker.geoData.lat, marker.geoData.lon])
                        .setIcon(new this.LeafIcon({iconUrl: this.defaultIcon, iconRetinaUrl: this.defaultIconRetina}))
                        .addTo(this.markerGroup)
                }
            })
        }
    }
}
