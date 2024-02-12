import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Capacitor } from "@capacitor/core";
import { AppBannerSettings } from "@globals/models/settings";
import { CookiesService } from "@services/core/cookie-service/cookies.service";
import { SharedObservableService } from "@services/core/shared-observables/shared-observables.service";
import { DeviceDetectorService } from "ngx-device-detector";

export interface AppStoreBannerProperties {
  appleStoreImageAlt: string;
  appleStoreImageSrc: string;
  playStoreImageAlt: string;
  playStoreImageSrc: string;
}

@Component({
  selector: "vents-app-store-banner",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./app-store-banner.component.html",
  styleUrls: ["./app-store-banner.component.css"],
})
export class AppStoreBannerComponent {
  bannerProperties: AppStoreBannerProperties;
  isBannerClosed = true;
  isMobile;
  isPlatformNative;
  platform;
  bannerSettings: AppBannerSettings;
  constructor(
    private cookiesService: CookiesService,
    private deviceService: DeviceDetectorService,
    private sharedObservableService: SharedObservableService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.isPlatformNative = Capacitor.isNativePlatform();
    this.platform = this.deviceService.getDeviceInfo().os;
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
