const mongoose = require("mongoose");
const Settings = mongoose.model(
  "Settings",
  new mongoose.Schema({
    isAdsActivated: Boolean,
    isPromotionActivated: Boolean,
    percentagOfAd: Number,
    appBannerSettings: {
      isAppBannerActivated: Boolean,
      appStoreLink: String,
      googlePlayLink: String,
    },
  })
);

module.exports = Settings;
