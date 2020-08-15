import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vents-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return  value / 10+ 'km';
    }

    return value;
  }
}
