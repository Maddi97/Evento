import { Component, Input } from "@angular/core";
import { CookiesService } from "../cookie-service/cookies.service";
import { Capacitor } from "@capacitor/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { SharedObservableService } from "../logic/shared-observables.service";
import { AppBannerSettings } from "src/app/models/settings";

export interface AppStoreBannerProperties {
  appleStoreImageAlt: string;
  appleStoreImageSrc: string;
  playStoreImageAlt: string;
  playStoreImageSrc: string;
}

@Component({
  selector: "vents-app-store-banner",
  templateUrl: "./app-store-banner.component.html",
  styleUrls: ["./app-store-banner.component.css"],
})
export class AppStoreBannerComponent {
  bannerProperties: AppStoreBannerProperties;
  isBannerClosed;
  isMobile;
  deviceInfo;
  bannerSettings: AppBannerSettings;
  constructor(
    private cookiesService: CookiesService,
    private deviceService: DeviceDetectorService,
    private sharedObservableService: SharedObservableService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.sharedObservableService.settingsObservable.subscribe((settings) => {
      this.bannerSettings =
        settings?.appBannerSettings || new AppBannerSettings();
    });

    this.bannerProperties = {
      appleStoreImageAlt: "Available on Apple Store",
      appleStoreImageSrc: "../../../assets/static-icons/app-store-badge.svg",
      playStoreImageAlt: "Get it on Google Play",
      playStoreImageSrc:
        "../../../../assets/static-icons/google-play-badge.png",
    };
    this.isBannerClosed =
      this.cookiesService.getCookie("bannerClosed") || false;
  }

  closeBanner = () => {
    this.isBannerClosed = true;
    this.cookiesService.setCookie("bannerClosed", true, 6);
  };
}
