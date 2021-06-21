import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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


  public nextMonth: DateClicked[] = [];
  public numberOfDates: number = 7;
  public firstDate: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.createDateList()
  }

  safeDate(day: Date) {
    this.nextMonth.map(m => {
      if (m.date === day) {
        m.isClicked = !m.isClicked
      } else {
        m.isClicked = false;
      }
    });
    this.clickedDate.emit(this.nextMonth.find(m => m.date === day));
  }

  createDateList() {
    const thisDay = moment(this.nextMonth[this.firstDate - 1] ? this.nextMonth[this.firstDate - 1].date : new Date());
    for ( let i = this.firstDate; i < this.numberOfDates; i++) {
      const day = thisDay.add(1, "days")
      this.nextMonth[i] = new DateClicked();
      this.nextMonth[i].date = new Date(day.toLocaleString());
      this.nextMonth[i].isClicked = false;
    }
  }

  addDates() {
    // TODO maybe try to add number of dates dynamically 
    this.numberOfDates += 7;
    this.firstDate += 7;
    this.createDateList()
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
