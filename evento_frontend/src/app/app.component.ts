import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Capacitor } from "@capacitor/core";
import { filter, take } from "rxjs";
import { SettingsService } from "./services/simple/settings/settings.service.service";
import { SharedObservableService } from "./services/core/shared-observables/shared-observables.service";
import { SessionStorageService } from "@services/core/session-storage/session-storage.service";
import { SUBDOMAIN_URLS } from "@globals/constants/subdomainUrls";
declare interface Window {
  adsbygoogle: any[];
}
declare var adsbygoogle: any[];
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

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private sharedObservableService: SharedObservableService,
    private sessionStorageService: SessionStorageService
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
          SUBDOMAIN_URLS.forEach((subdomain) => {
            if (event.url.includes(subdomain)) {
              isNotEventsPage = true;
            }
          });
          if (!isNotEventsPage) {
            this.sessionStorageService.removePositionFromStorage();
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
    if (Capacitor.getPlatform() === "web") {
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
