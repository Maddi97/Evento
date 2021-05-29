import { Component, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { Event } from '../models/event';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  mapView = false;

  eventList: Event[] = [];
  filteredList: Event[] = [];
  filteredCategories = [];

  categoryList: Category[] = [];

  constructor(
    private eventService: EventService,
    private categoriesService: CategoriesService,

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
    console.log(filter);
    if (filter.isClicked) {
      this.filteredList = this.filteredList
      .filter(f => (new Date(f.date).getDay() === filter.date.getDay() && new Date(f.date).getMonth() === filter.date.getMonth()));
    } else {
      this.filteredList = this.eventList;
    }
  }

  searchForCategory(cat: Category) {
    this.filteredList = this.filteredList.filter(f => f.category._id === cat._id);
    this.filteredCategories.push(cat._id)
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
