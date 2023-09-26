import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SessionStorageService } from "../common-utilities/session-storage/session-storage.service";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-footerbar",
  templateUrl: "./footerbar.component.html",
  styleUrls: ["./footerbar.component.css"],
})
export class FooterbarComponent implements OnInit {
  windowWidth;
  queryParams: any;
  footerPickedField: 'settings' | 'categories' | 'events';
  constructor(
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.footerPickedField = this.getCurrentFooterPickedField()
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize() {
    this.windowWidth = window.innerWidth;
  }

  changeMapView() {
    this.sessionStorageService.setMapViewData(false);
  }
  getCurrentFooterPickedField() {
    const url = this.document.location.pathname;
    if (url.includes('settings')) {
      return 'settings'
    }
    else if (url.includes('categories')) {
      return 'categories'
    }
    else return 'events'
  }
  setFooterPickedField(footerPickedField: 'settings' | 'categories' | 'events') {
    this.footerPickedField = footerPickedField;
  }
}
