const mongoose = require("mongoose");
const Settings = mongoose.model(
  "Settings",
  new mongoose.Schema({
    isAdsActivated: Boolean,
    isPromotionActivated: Boolean,
  })
);
module.exports = Settings;
