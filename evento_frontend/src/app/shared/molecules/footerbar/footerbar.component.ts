import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { MapCenterViewService } from "@services/core/map-center-view/map-center-view.service";
import { MatIconModule } from "@angular/material/icon";

type FooterPickedField = "/settings" | "/categories" | "/";

@Component({
  selector: "app-footerbar",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
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
    private mapCenterViewService: MapCenterViewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = window.innerWidth;
    }
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
    this.mapCenterViewService.setMapViewData(false);
  }

  setFooterPickedField(footerPickedField: "/settings" | "/categories" | "/") {
    this.footerPickedField = footerPickedField;
  }
}
