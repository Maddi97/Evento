import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'vents-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Output() clickedDate = new EventEmitter<DateClicked>();

  @ViewChild(MatCalendar) datePicker: MatCalendar<Date>;

  public getScreenWidth: any;

  public nextMonth: DateClicked[] = [];
  public numberOfDates = 10;
  public displayNumberOfDates = 5;
  public firstDate = 0;


  constructor() {
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > 700) {
      this.numberOfDates = Number(this.getScreenWidth / 100)
    }
    else {
      this.numberOfDates = 7;
    }

    this.createDateList();
  }

  safeDate(day: moment.Moment) {
    this.nextMonth.map(m => {
      if (m.date === day) {
        m.isClicked = true;
      }
      else {
        m.isClicked = false;
      }
    });
    const emitDate = this.nextMonth.find(m => m.date === day);
    this.clickedDate.emit(emitDate);
  }

  createDateList() {

    const thisDay = moment(this.nextMonth[this.firstDate - 1] ?
      this.transformDateFormat(new Date()) : this.transformDateFormat(new Date()));
    for (let i = this.firstDate; i < this.numberOfDates; i++) {
      const day = thisDay.clone().add(i, 'days');

      this.nextMonth[i] = new DateClicked();
      this.nextMonth[i].date = day;
      if (i === this.firstDate) {
        this.safeDate(this.nextMonth[i].date);
      }
      else {
        this.nextMonth[i].isClicked = false;
      }
    }
  }

  @HostListener('scroll') onScroll(e: Event): void {
    this.getYPosition(e);
  }

  getYPosition(e: Event): void {
    console.log(e)
  }

  addDates() {
    // TODO maybe try to add number of dates dynamically
    this.numberOfDates += this.displayNumberOfDates;
    this.firstDate += this.displayNumberOfDates;
    this.createDateList();
  }

  transformDateFormat(date) {
    date = moment(date.toISOString()).utcOffset(0, false);
    date.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    // date.toISOString()
    return moment(date);
  }

}

class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
