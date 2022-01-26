import {Component, OnChanges, OnInit, Input, OnDestroy} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from "./position.service";

@Component({
    selector: 'map-view',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnChanges {
    @Input() marker_data = [];
    private map;
    private markerGroup
    private positionMarkerGroup
    address = ""

    current_position = {
        lat: "",
        lon: ""
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
    ) {}


    ngOnInit(): void {
        this.updatePosition(this.positionService.getDefaultLocation())
    }


    updatePosition(location_list) {
        this.current_position.lat = location_list[0]
        this.current_position.lon = location_list[1]
    }

    resetCenter() {
        this.updatePosition(this.positionService.getCurrentPosition())
        this.setPositionMarker()
        this.map.panTo((new L.LatLng(this.current_position.lat, this.current_position.lon)))
    }


    ngOnChanges(): void {
        if (typeof this.map == 'undefined') {
            this.initMap()
        }
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);

        this.setPositionMarker()
        this.setMarkers(this.marker_data)
    }

    private initMap(): void {
        if (this.current_position.lat === "" || this.current_position.lon === "") {
            this.updatePosition(this.positionService.getCurrentPosition())
        }

        if(document.getElementById('map').className == '') {
            this.map = L.map('map', {
                center: [this.current_position.lat, this.current_position.lon],
                zoom: 11
            });
        }
        else {
            document.getElementById('map').remove()
            this.map = L.map('map', {
                center: [this.current_position.lat, this.current_position.lon],
                zoom: 11
            });

        }

        this.positionMarkerGroup = L.layerGroup().addTo(this.map);
        this.markerGroup = L.layerGroup().addTo(this.map);
    }

    private setPositionMarker(): void {
        this.positionMarkerGroup.clearLayers();
        L.marker([this.current_position.lat, this.current_position.lon])
            .setIcon(new this.LeafIcon({iconUrl: this.locationIcon, iconRetinaUrl: this.locationIconRetina}))
            .addTo(this.positionMarkerGroup);
    }

    private setMarkers(marker_data): void {
        this.markerGroup.clearLayers();
        if (typeof marker_data != 'undefined') {
            marker_data.map(marker => {
                if (typeof marker.geo_data != 'undefined') {
                    L.marker([marker.geo_data.lat, marker.geo_data.lon])
                        .setIcon(new this.LeafIcon({iconUrl: this.defaultIcon, iconRetinaUrl: this.defaultIconRetina}))
                        .addTo(this.markerGroup)
                }
            })
        }
    }
}
