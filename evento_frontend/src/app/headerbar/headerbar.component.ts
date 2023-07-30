import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {
  searchText = '';
  filteredDate: moment.Moment = moment(new Date()).utcOffset(0, false).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })
  ;

  constructor(
    private location: Location,
  ) {
  }

  ngOnInit(): void {
  }

  navBack() {
    this.location.back();
  }


  searchForDay(filter: DateClicked) {
    this.filteredDate = filter.date;
  }


}


class DateClicked {
  date: moment.Moment;
  isClicked: boolean;
}
