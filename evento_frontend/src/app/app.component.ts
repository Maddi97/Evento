import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Capacitor } from "@capacitor/core";
import { filter, take } from "rxjs";
import { SettingsService } from "./services/simple/settings/settings.service.service";
import { SharedObservableService } from "./services/core/shared-observables/shared-observables.service";
import { SessionStorageService } from "@services/core/session-storage/session-storage.service";
import { SUBDOMAIN_URLS } from "@globals/constants/subdomainUrls";
import { isPlatformBrowser } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomRouterService } from "@services/core/custom-router/custom-router.service";
import { Settings } from "@globals/models/settings";
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
  isPlatformBrowser = false;
  private cookieMessage =
    "Diese Website verwendet nur essenzielle Cookies. Erfahrunge mehr über die verwendeten Cookies in unsererem Datenschutzbereich" +
    "";
  private cookieDismiss = "Verstanden!";
  private cookieLinkText = "Hier gehts zur Datenschutzerklärung";
  settings: Settings;
  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private sharedObservableService: SharedObservableService,
    private customRouterService: CustomRouterService,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
    //only get position on first creation and not on routing inside the spa
    this.settingsService.getSettings().subscribe((settings) => {
      this.sharedObservableService.setSettings(settings);
      this.settings = settings;
    });
    this.customRouterService.getQueryParams().subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.spinner.show();
      }
    });

    if (
      Capacitor.getPlatform() === "web" &&
      isPlatformBrowser(this.platformId)
    ) {
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
