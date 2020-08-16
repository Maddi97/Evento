import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vents-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Output() clickedDate = new EventEmitter<Date>();

  public nextMonth: DateClicked[] = [];
  constructor() { }

  ngOnInit(): void {
    const today = new Date();
    const thisDay = new Date();
    for ( let i = 0; i < 7; i++) {
      const day = thisDay.setDate(today.getDate() + i);
      this.nextMonth[i] = new DateClicked();
      this.nextMonth[i].date = new Date(day);
      this.nextMonth[i].isClicked = false;
    }
  }

  safeDate(day: Date) {
    this.clickedDate.emit(day);
    this.nextMonth.map(m => {
      if (m.date === day) {
        if (m.isClicked === true) {
          m.isClicked = false;
          return;
        }
        m.isClicked = true;
      } else {
        m.isClicked = false;
      }
    });
  }
}

class DateClicked {
  date: Date;
  isClicked: boolean;
}
