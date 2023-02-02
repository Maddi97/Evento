import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.css']
})
export class HeaderbarComponent implements OnInit {
  searchText = '';

  constructor(
    private location: Location,
  ) {
  }

  ngOnInit(): void {
  }

  navBack() {
    this.location.back();
  }


}
