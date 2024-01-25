import {Component, LOCALE_ID, OnInit} from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';


@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.css']
})
export class DigitalClockComponent {
  name = 'evento';
  date: string;
  hours: any;
  minutes: any;
  seconds: any;
  currentLocale: any;

  isTwelveHrFormat: false;

  constructor() {

    setInterval(() => {
      const currentDate = new Date();
      this.date = currentDate.toLocaleTimeString();
    }, 1000);
  }
}



