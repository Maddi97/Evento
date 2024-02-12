import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ActivatedRoute, RouterModule } from "@angular/router";

@Component({
  selector: "app-hamburger-menu",
  standalone: true,
  imports: [MatIconModule, MatMenuModule, RouterModule],
  templateUrl: "./hamburger-menu.component.html",
  styleUrls: ["./hamburger-menu.component.css"],
})
export class HamburgerMenuComponent implements OnInit {
  queryParams: any;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
  }
}
