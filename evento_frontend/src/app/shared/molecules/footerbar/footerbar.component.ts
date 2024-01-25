import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionStorageService } from "@services/core/session-storage/session-storage.service";
import { DOCUMENT } from "@angular/common";

type FooterPickedField = "/settings" | "/categories" | "/";

@Component({
  selector: "app-footerbar",
  templateUrl: "./footerbar.component.html",
  styleUrls: ["./footerbar.component.css"],
})
export class FooterbarComponent implements OnInit {
  windowWidth;
  queryParams: any;
  footerPickedField: FooterPickedField;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.footerPickedField = url.split("?")[0] as FooterPickedField; // Split the string into an array at the first '?'
    });
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize() {
    this.windowWidth = window.innerWidth;
  }

  changeMapView() {
    this.sessionStorageService.setMapViewData(false);
  }

  setFooterPickedField(footerPickedField: "/settings" | "/categories" | "/") {
    this.footerPickedField = footerPickedField;
  }
}
