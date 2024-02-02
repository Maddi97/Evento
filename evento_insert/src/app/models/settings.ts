export class Settings {
  _id: string;
  isAdsActivated: boolean;
  isPromotionActivated: boolean;
  percentagOfAd: number;
  appBannerSettings: AppBannerSettings;
}

export class AppBannerSettings {
  isAppBannerActivated: boolean;
  appStoreLink: string;
  googlePlayLink: string;
}
