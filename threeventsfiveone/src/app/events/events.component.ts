import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../models/event';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../models/category';
import {MatSliderChange} from "@angular/material/slider";
import {PositionService} from "../map-view/position.service";
import {NominatimGeoService} from "../nominatim-geo.service";

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  mapView = false;

  eventRange = 10

  eventList: Event[] = [];
  filteredList: Event[] = [];
  filteredCategories = [];

  filterDistanceEvents = []

  categoryList: Category[] = [];

  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,
    private positionService: PositionService,
    private geoService: NominatimGeoService
  ) { }

  ngOnInit(): void {
    this.eventService.events.subscribe((ev: Event[]) => {
      this.eventList = ev;
      this.filteredList = this.eventList;
      if (ev.length === 0) {
        this.eventService.getAllEvents();
      }
    });
    this.categoriesService.categories.subscribe((cat: Category[]) => {
      this.categoryList = cat;
      if (cat.length === 0) {
        this.categoriesService.getAllCategories();
      }
    });
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return  value / 10 + 'km';
    }

    return value;
  }

  searchForDay(filter: DateClicked) {
    if (filter.isClicked) {
      this.filteredList = this.filteredList
      .filter(f => (new Date(f.date).getDay() === filter.date.getDay() && new Date(f.date).getMonth() === filter.date.getMonth()));
    } else {
      let adding_events = this.eventList.filter(event => {
        new Date(event.date).getDay() === filter.date.getDay() && new Date(event.date).getMonth() === filter.date.getMonth()
      })
      this.filteredList = this.filteredList.concat(adding_events)
    }
  }

  searchForCategory(category: Category) {
    if (!this.filteredCategories.includes(category._id)) {
      this.filteredList = this.filteredList.filter(event => event.category._id === category._id);
      this.filteredCategories.push(category._id)
    }
    else {
      let adding_events = this.eventList.filter(event => event.category._id !== category._id)
      this.filteredList = this.filteredList.concat(adding_events)
      let index = this.filteredCategories.indexOf(category._id)
      this.filteredCategories.splice(index, 1)
    }
  }

  searchForSubCategory(subCategory) {
  //  TODO Wait For Model Structure Of Subcategory https://github.com/schndrrr/3vents51/tree/insertAppBackendCreateObjectForSubcategories
  }

  searchForDistance(sliderEvent: MatSliderChange) {

    let clone_filter_list = this.filteredList
    clone_filter_list = clone_filter_list.concat(this.filterDistanceEvents)
    this.filterDistanceEvents = []

    const distances = {};
    const promises = [];

    clone_filter_list.forEach(event => {
      let promise = this.geoService.get_distance(this.positionService.getCurrentPosition(), [event.geo_data.lat, event.geo_data.lon]).toPromise().then(data => {
        let parsed_data = JSON.parse(JSON.stringify(data))
        distances[event._id] = parsed_data.routes[0].distance / 1000
      })
      promises.push(promise)
    })

    Promise.all(promises).then(values => {
      this.filteredList = clone_filter_list.filter(event => {
        if (distances[event._id] < sliderEvent.value) {
          return true
        }
        else {
          this.filterDistanceEvents.push(event)
          return false
        }
      })
    })
  }

  isElementPicked(cat: Category) {
    if (this.filteredCategories.includes(cat._id)) {
      return 'category-picked'
    }
    else {
      return 'category-non-picked'
    }
  }

  clearFilter() {
    this.filteredList = this.eventList;
    this.filteredCategories = []
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
