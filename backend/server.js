// modules =================================================
const express = require("express");
const event_routes = require("./app/routes/event.routes");
const app = express();
var mongoose = require("mongoose");
// set our port
const port = 3000;
// configuration ===========================================

app.use("/api/", router);

// config files
var db = require("./config/db");
console.log("connecting--", db);
mongoose.connect(db.url); //Mongoose connection created

// startup our app at http://localhost:3000
app.listen(port, () =>
  console.log(`3vents51 backend listening on port ${port}!`)
);
