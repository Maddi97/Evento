import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'vents-day-date',
  templateUrl: './day-date.component.html',
  styleUrls: ['./day-date.component.css']
})
export class DayDateComponent implements OnInit {

  @Input() date: moment.Moment;

  @Input() isClicked = false;

  days: string[] = [
    'So',
    'Mo',
    'Di',
    'Mi',
    'Do',
    'Fr',
    'Sa'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  dayToString(): string {
    return this.date.format('ddd');
  }

  dateToString(): string {
    return  this.date.format('DD.MM');
  }

}
