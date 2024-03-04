import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { Settings } from "@globals/models/settings";
import { SubdomainUrl } from "@globals/types/url.types";
import { CustomRouterService } from "@services/core/custom-router/custom-router.service";
import { PositionService } from "@services/core/location/position.service";
import { SharedObservableService } from "./services/core/shared-observables/shared-observables.service";
import { SettingsService } from "./services/simple/settings/settings.service.service";

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
  actualSubdomain: SubdomainUrl = "";
  constructor(
    private settingsService: SettingsService,
    private sharedObservableService: SharedObservableService,
    private customRouterService: CustomRouterService,
    private positionService: PositionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
    if (this.isPlatformBrowser) {
      this.positionService.getGeoLocation();
    }
    //only get position on first creation and not on routing inside the spa
    this.settingsService.getSettings().subscribe((settings) => {
      this.sharedObservableService.setSettings(settings);
      this.settings = settings;
    });
    if (isPlatformBrowser(this.platformId)) {
      this.customRouterService.getQueryParams().subscribe();
    }
    this.customRouterService
      .getSubdomain()
      .subscribe(
        (subdomain: SubdomainUrl) => (this.actualSubdomain = subdomain)
      );
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
