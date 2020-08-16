import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'vents-day-date',
  templateUrl: './day-date.component.html',
  styleUrls: ['./day-date.component.css']
})
export class DayDateComponent implements OnInit {

  @Input() date: Date;

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

  dayToString(day: number): string {
    return this.days[day];
  }

  dateToString(): string {
    return this.date.getDate() + '.' + Number(this.date.getMonth() + 1);
  }

}
