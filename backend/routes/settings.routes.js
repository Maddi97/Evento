const Settings = require("../model/settings.model");
var express = require("express");
var router = express.Router();
const auth = require("../middleware/authJWT");
const limiter = require("../middleware/rateLimiter");

router.get("/settings", limiter, (req, res) => {
  Settings.find({})
    .then((settings) => res.send(settings[0]))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.patch("/settings", limiter, auth, (req, res) => {
  const settings = new Settings(req.body);
  Settings.findOneAndUpdate(
    { _id: settings._id },
    { $set: settings },
    { returnOriginal: false }
  )
    .then((settings) => res.send(settings))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/settings", limiter, auth, (req, res) => {
  new Settings(req.body)
    .save()
    .then((settings) => res.send(settings))
    .catch((error) => {
      console.error("Internal error in Settings:", error);
      res.status(500).json({ message: "Internal error in Settings: ", error });
    });
});

module.exports = router;
