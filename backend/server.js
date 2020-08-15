// modules =================================================
const express = require("express");
const app = express();
var mongoose = require("mongoose");
// set our port
const port = 3000;
// configuration ===========================================

// config files
var db = require("./config/db");
console.log("connecting--", db);
mongoose.connect(db.url); //Mongoose connection created

// frontend routes =========================================================
app.get("/", (req, res) => res.send("Welcome to Tutorialspoint!"));

//defining route
app.get("/tproute", function (req, res) {
  res.send(
    "This is routing for the application developed using Node and Express..."
  );
});

// sample api route
// grab the student model we just created
var Student = require("./app/models/student");
app.get("/api/students", function (req, res) {
  // use mongoose to get all students in the database
  Student.find(function (err, students) {
    // if there is an error retrieving, send the error.
    // nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(students); // return all students in JSON format
  });
});
// startup our app at http://localhost:3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
