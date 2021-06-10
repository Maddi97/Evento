import {Component, OnInit} from '@angular/core';
import {EventService} from './event.service';
import {Event} from '../models/event';
import {CategoriesService} from '../categories/categories.service';
import {Category} from '../models/category';
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

  // List of all Events
  eventList: Event[] = [];

  filteredList: Event[] = [];

  filteredText: string = "";

  filteredDates = [];

  filteredCategoryIDs = [];

  filteredDistance = 10;

  eventsInRange = []

  eventDistances = {}

  distanceChanged = false;
  positionChanged = false;
  currentPosition;

  // List of all Categories
  categoryList: Category[] = [];


  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,
    private positionService: PositionService,
    private geoService: NominatimGeoService
  ) {
  }

  ngOnInit(): void {
    this.eventService.events.subscribe((ev: Event[]) => {
      this.eventList = ev;
      this.filteredList = this.eventList;
      if (ev.length === 0) {
        this.eventService.getAllEvents();
      }
      this.currentPosition = this.positionService.getCurrentPosition()
      this.distanceChanged = true
      // TODO this is run twice
      this.applyDistanceSearch()
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
      return value / 10 + 'km';
    }

    return value;
  }

  filter() {
    this.positionChanged = this.currentPosition !== this.positionService.getCurrentPosition();

    if (this.positionChanged || this.distanceChanged) {
      // TODO error ERROR Error: Uncaught (in promise): TypeError: this is undefined
      this.applyDistanceSearch().then(() => this.applyFilters())
    } else {
      this.applyFilters()
    }
  }

  applyFilters() {

    let newFilteredList = this.eventList
    // Filter By Date

    if (this.filteredDates.length !== 0) {
      newFilteredList = newFilteredList.filter(event => {
        let event_picked = false
        this.filteredDates.forEach(date => {
          if (event_picked) {
            return event_picked
          }
          event_picked = new Date(event.date).getDay() === date.getDay() && new Date(event.date).getMonth() === date.getMonth();
        })
        return event_picked
      })
    }

    //Filter By Category
    if (this.filteredCategoryIDs.length !== 0) {
      newFilteredList = newFilteredList.filter(event => {
        let event_picked = false
        this.filteredCategoryIDs.forEach(category_id => {
          if (event_picked) {
            return event_picked
          }
          event_picked = event.category._id === category_id
        })
        return event_picked
      })
    }

    //Filter By Text
    if (this.filteredText !== "") {
      newFilteredList = newFilteredList.filter(event => {
        return event.name.toLowerCase().includes(this.filteredText.toLowerCase())
      })
    }

    newFilteredList = newFilteredList.filter(event => {
      return this.eventsInRange.includes(event)
    })

    console.log(this.eventsInRange)

    this.filteredList = newFilteredList
  }

  searchForDay(filter: DateClicked) {
    if (filter.isClicked) {
      this.filteredDates.push(filter.date)
    } else {
      this.filteredDates = this.filteredDates.filter(date => date.getDay() !== filter.date.getDay() || date.getMonth() !== filter.date.getMonth())
    }
    this.filter()
  }

  searchForCategory(category: Category) {
    if (!this.filteredCategoryIDs.includes(category._id)) {
      this.filteredCategoryIDs.push(category._id)
    } else {
      let index = this.filteredCategoryIDs.indexOf(category._id)
      this.filteredCategoryIDs.splice(index, 1)
    }
    this.filter()
  }

  async applyDistanceSearch() {
    this.eventDistances = {};

    if (this.distanceChanged || this.positionChanged) {
      console.log('Updating distances!')
      const promises = [];

      this.currentPosition = this.positionService.getCurrentPosition()

      this.eventList.forEach(event => {
        let promise = this.geoService.get_distance(this.positionService.getCurrentPosition(), [event.geo_data.lat, event.geo_data.lon]).toPromise().then(data => {
          let parsed_data = JSON.parse(JSON.stringify(data))
          this.eventDistances[event._id] = parsed_data.routes[0].distance / 1000
        })
        promises.push(promise)
      })

      Promise.all(promises).then(value => {
        this.eventsInRange = this.eventList.filter(event => {
          return this.eventDistances[event._id] < this.filteredDistance;
        })
        this.distanceChanged = false
        this.positionChanged = false
        console.log('Distances updated!')
      })
    } else {
      this.filterListByDistance()
    }
  }

  filterListByDistance() {
    this.eventsInRange = this.eventList.filter(event => {
      return this.eventDistances[event._id] < this.filteredDistance;
    })
  }

  async searchForDistance(sliderDistance) {
    this.filteredDistance = sliderDistance
    this.distanceChanged = true
    // TODO error ERROR Error: Uncaught (in promise): TypeError: this is undefined
    this.applyDistanceSearch().then(() => this.applyFilters())
  }

  isElementPicked(cat: Category) {
    if (this.filteredCategoryIDs.includes(cat._id)) {
      return 'category-picked'
    } else {
      return 'category-non-picked'
    }
  }

  clearFilter() {
    this.filteredList = this.eventList;
    this.filteredCategoryIDs = []
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
