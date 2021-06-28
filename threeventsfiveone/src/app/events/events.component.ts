import {Component, OnInit} from '@angular/core';
import {EventService} from './event.service';
import {Event} from '../models/event';
import {CategoriesService} from '../categories/categories.service';
import {Category} from '../models/category';
import {PositionService} from '../map-view/position.service';
import {NominatimGeoService} from '../nominatim-geo.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import * as log from 'loglevel';

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  mapView = false;

  // List of all Events
  eventList: Event[] = [];

  // List of filtered Events
  filteredList: Event[] = [];

  // Text by which the events get filtered
  filteredText = '';

  // Applied filtered Dates
  filteredDates = [];

  // Applied filtered Category IDs
  filteredCategoryIDs = [];

  // Applied Subcategory Filter
  filteredSubcategories = [];

  // Range for the events
  filteredDistance = 10;

  // List of events in range to current position with filteredDistance
  eventsInRange = [];

  // Range of events to current position
  eventDistances = {};

  distanceChanged = true;
  positionChanged = false;
  currentPosition;

  // List of all Categories
  categoryList: Category[] = [];

  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,
    private positionService: PositionService,
    private geoService: NominatimGeoService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

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

    this.route.queryParams.subscribe(data => {
      if (data.subcategory !== undefined) {
        const matchingCategory: Category[] = [];
        this.categoryList.forEach(category => {
          if (category.subcategories.map( subcategory =>
            {
              if (subcategory._id == data.subcategory._id) { return true; }
              else { return false; }
            }
          )) {
            matchingCategory.push(category);
          }
        });
        this.filteredCategoryIDs.push(matchingCategory[0]._id);
        this.filteredSubcategories.push(data.subcategory);
        this.filter();
      }
      this.router.navigate(['/', 'events']);
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

    this.spinner.show();
    if (this.positionChanged || this.distanceChanged) {
      this.applyDistanceSearch().then(() => this.applyFilters());
    } else {
      this.applyFilters();
    }
  }

  applyFilters() {
    log.info('Filtering')
    let newFilteredList = this.eventList;

    // Filter By Date
    if (this.filteredDates.length !== 0) {
      newFilteredList = newFilteredList.filter(event => {
        let event_picked = false;
        this.filteredDates.forEach(date => {
          if (event_picked) {
            return event_picked;
          }
          event_picked = new Date(event.date).getDay() === date.getDay() && new Date(event.date).getMonth() === date.getMonth();
        });
        return event_picked;
      });
    }

    // Filter By Category
    if (this.filteredCategoryIDs.length !== 0) {
      newFilteredList = newFilteredList.filter(event => {
        let event_picked = false;
        this.filteredCategoryIDs.forEach(category_id => {
          if (event_picked) {
            return event_picked;
          }
          event_picked = event.category._id === category_id;
        });
        return event_picked;
      });
    }

    // Filter By Subcategory
    if (this.filteredSubcategories.length !== 0) {
      newFilteredList = newFilteredList.filter(event => {
        let event_picked = false;
        this.filteredSubcategories.forEach(subcategory => {
          if (event_picked) {
            return event_picked;
          }
          event_picked = event.category.subcategories.every( sub =>
            {
              if (sub._id === subcategory._id) {
                return true;
              }
              return false;
            }
          );
        });
        return event_picked;
      });
    }

    // Filter By Text
    if (this.filteredText !== '') {
      newFilteredList = newFilteredList.filter(event => {
        return event.name.toLowerCase().includes(this.filteredText.toLowerCase());
      });
    }

    // Filter By Distance
    newFilteredList = newFilteredList.filter(event => {
      return this.eventsInRange.includes(event);
    });

    this.filteredList = newFilteredList;
    this.spinner.hide();
  }

  searchForDay(filter: DateClicked) {
    if (filter.isClicked) {
      this.filteredDates.push(filter.date);
    } else {
      this.filteredDates = this.filteredDates.filter(date => date.getDay() !== filter.date.getDay() || date.getMonth() !== filter.date.getMonth());
    }
    this.filter();
  }

  searchForCategory(category: Category) {
    if (!this.filteredCategoryIDs.includes(category._id)) {
      this.filteredCategoryIDs.push(category._id);
    } else {
      const index = this.filteredCategoryIDs.indexOf(category._id);
      this.filteredCategoryIDs.splice(index, 1);
    }
    this.filter();
  }

  searchForSubCategory(subcategory) {
    if (this.filteredSubcategories.every( sub =>
      {
        if (sub._id === subcategory._id) {
          return true;
        }
        return false;
      }
    ) &&  this.filteredSubcategories.length != 0) {
      let index = 0;
      this.filteredSubcategories.map(sub => {
        if (sub._id = subcategory._id) { return; }
        index += 1;
      });
      this.filteredSubcategories.splice(index, 1);
    } else {
      this.filteredSubcategories.push(subcategory);
    }
    this.filter();
  }

  applyDistanceSearch() {
    return new Promise(resolve => {
      this.eventDistances = {};

      if (this.distanceChanged || this.positionChanged) {
        log.info('Updating distances!');
        const promises = [];

        this.currentPosition = this.positionService.getCurrentPosition();

        this.eventList.forEach(event => {
          const promise = this.geoService.get_distance(this.positionService.getCurrentPosition(), [event.geo_data.lat, event.geo_data.lon]).toPromise().then(data => {
            const parsed_data = JSON.parse(JSON.stringify(data));
            this.eventDistances[event._id] = parsed_data.routes[0].distance / 1000;
          });
          promises.push(promise);
        });

        Promise.all(promises).then(() => {
          this.filterListByDistance();
          this.distanceChanged = false;
          this.positionChanged = false;
          log.info('Distances updated!');
          resolve();
        });
      } else {
        this.filterListByDistance();
        resolve();
      }
    });
  }

  filterListByDistance() {
    this.eventsInRange = this.eventList.filter(event => {
      return this.eventDistances[event._id] < this.filteredDistance;
    });
  }

  searchForDistance(sliderEvent) {
    this.distanceChanged = true;
    this.filter();
  }

  isElementPicked(cat: Category) {
    if (this.filteredCategoryIDs.includes(cat._id)) {
      return 'category-picked';
    } else {
      return 'category-non-picked';
    }
  }

  isSubcategoryPicked(subcategory) {
    if (this.filteredSubcategories.every( sub =>
      {
        if (sub._id === subcategory._id) {
          return true;
        }
        return false;
      }
    ) && this.filteredSubcategories.length != 0) {
      return 'category-picked';
    } else {
      return 'category-non-picked';
    }
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true;
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
