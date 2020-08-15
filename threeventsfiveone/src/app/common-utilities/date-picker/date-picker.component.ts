import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vents-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  public nextMonth: Date[] = [];
  constructor() { }

  ngOnInit(): void {
    const today = new Date();
    const thisDay = new Date();
    for ( let i = 0; i < 7; i++) {
      const day = thisDay.setDate(today.getDate() + i);
      this.nextMonth.push(new Date(day));
    }
    console.log(this.nextMonth);
  }

  safeDate(day: Date) {
    console.log(day);
  }
}
