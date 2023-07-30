import {Component, HostListener, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footerbar',
  templateUrl: './footerbar.component.html',
  styleUrls: ['./footerbar.component.css']
})
export class FooterbarComponent implements OnInit {
  windowWidth;
  queryParams: any; 

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
     this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.windowWidth = window.innerWidth;
  }

}
