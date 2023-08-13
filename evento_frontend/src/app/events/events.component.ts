import { Component, HostListener, OnInit } from '@angular/core';
import { Event } from '../models/event';
import * as moment from 'moment';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public isDropdown = false;

  mapView = false;

  eventList: Event[] = [];
  // Applied filtered Category IDs

  hoveredEventId = null;
  filteredCategory = 'hot';
  // filteredSubcategories
  filteredSubcategories = [];
  scrollLeftMax: Boolean;
  scrollRightMax: Boolean;
  // clicked date
  filteredDate: moment.Moment = moment(new Date()).utcOffset(0, false).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })
    ;


  public getScreenWidth: any;

  constructor() {
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    timer(1 * 1).pipe(
      take(1)
    ).subscribe(() => window.scrollTo(0, 0));
  }


  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date;
  }

  getEventFromId() {
    const event = this.eventList.find(event => event._id === this.hoveredEventId);
    return event || null;
  }

  changeToMapView() {
    this.mapView ? this.mapView = false : this.mapView = true;
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.getScreenWidth = window.innerWidth;
    this.setScrollMaxBool()
  }

  scrollRight() {
    const element = document.getElementById('main-category-container')
    element.scrollLeft += 80;
    this.setScrollMaxBool()
    // if max scrolled true then true
  }

  scrollLeft() {
    const element = document.getElementById('main-category-container')
    element.scrollLeft -= 80;
    this.setScrollMaxBool()
  }

  @HostListener('window:mouseover', ['$event'])
  setScrollMaxBool() {
    const element = document.getElementById('main-category-container')
    this.scrollLeftMax = (element.scrollLeft === 0)
    this.scrollRightMax = (element.scrollLeft === element.scrollWidth - element.clientWidth);
  }
}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
