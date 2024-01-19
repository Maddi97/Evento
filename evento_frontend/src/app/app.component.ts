import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Capacitor } from "@capacitor/core";
import { filter, take } from "rxjs";
import { PositionService } from "./common-utilities/map-view/position.service";
import { SettingsService } from "./settings.service.service";
import { Settings } from "./models/settings";
import { SharedObservableService } from "./common-utilities/logic/shared-observables.service";

export type SubdomainUrl = "settings" | "categories" | "full-event";
export const subDomainUrls: SubdomainUrl[] = [
  "settings",
  "categories",
  "full-event",
];
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Evento Leipzig";
  private cookieMessage =
    "Diese Website verwendet nur essenzielle Cookies. Erfahrunge mehr über die verwendeten Cookies in unsererem Datenschutzbereich" +
    "";
  private cookieDismiss = "Verstanden!";
  private cookieLinkText = "Hier gehts zur Datenschutzerklärung";

  private settings: Settings;

  constructor(
    private positionService: PositionService,
    private router: Router,
    private settingsService: SettingsService,
    private sharedObservableService: SharedObservableService
  ) {}

  ngOnInit(): void {
    //only get position on first creation and not on routing inside the spa
    this.settingsService.getSettings().subscribe((settings) => {
      this.sharedObservableService.setSettings(settings);
    });
    const subscription$ = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe({
        next: (event: NavigationEnd) => {
          let isNotEventsPage = false;
          subDomainUrls.forEach((subdomain) => {
            if (event.url.includes(subdomain)) {
              isNotEventsPage = true;
            }
          });
          if (!isNotEventsPage) {
            this.positionService.getPositionByLocation(true);
          }
        },
        error: (error) => {
          // Handle error here
          console.error("An error occurred while fetching categories", error);
        },
        complete: () => {
          subscription$.unsubscribe();
        },
      });
    if (!Capacitor.isNativePlatform()) {
      const cc = window as any;
      cc.cookieconsent.initialise({
        palette: {
          popup: {
            background: "#164969",
          },
          button: {
            background: "#ffe000",
            text: "#164969",
          },
        },
        theme: "classic",
        content: {
          message: this.cookieMessage,
          dismiss: this.cookieDismiss,
          link: this.cookieLinkText,
          href: window.location.href + "/settings",
        },
      });
    }
  }
}
