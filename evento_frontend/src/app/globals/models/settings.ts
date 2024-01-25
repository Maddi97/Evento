export class Settings {
  _id: string;
  isAdsActivated: boolean;
  isPromotionActivated: boolean;
  percentagOfAd: number;
  appBannerSettings: AppBannerSettings;
}

export class AppBannerSettings {
  isAppBannerActivated: boolean = true;
  appStoreLink: string;
  googlePlayLink: string;
}
