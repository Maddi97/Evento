import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.css']
})
export class HamburgerMenuComponent implements OnInit {
  queryParams: any; 
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
         this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
  }

}
