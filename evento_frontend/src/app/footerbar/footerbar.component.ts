import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-footerbar',
  templateUrl: './footerbar.component.html',
  styleUrls: ['./footerbar.component.css']
})
export class FooterbarComponent implements OnInit {
  windowWidth;

  constructor() {
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.windowWidth = window.innerWidth;
  }

}
