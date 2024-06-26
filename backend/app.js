// modules =================================================
const express = require("express");
const compression = require("compression");

// set our port
const port = 3000;
const app = express();
var cors = require("cors");

// configuration ===========================================
const mongoose = require("./config/mongoose");
const mongoSanitize = require("express-mongo-sanitize");
//const xss = require("xss-clean")
const allowedOrigins = [
  "http://192.168.0.112",
  "http://192.168.0.112:3000",
  "http://192.168.0.112:4200",
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
  "http://localhost:8080",
  "http://localhost:8100",
  "http://localhost:4200",
  "http://localhost:4201",
  "https://insert.evento-leipzig.de",
  "https://insert.staging.evento-leipzig.de",
  "https://evento-leipzig.de",
  "https://staging.evento-leipzig.de",
  "https://www.evento-leipzig.de",
  "https://www.staging.evento-leipzig.de",
  "https://backend.evento-leipzig.de",
  "https://backend.staging.evento-leipzig.de",
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Origin not allowed by CORS"));
    }
  },
};

// Enable preflight requests for all routes
app.options("*", cors(corsOptions));

app.get("/", cors(corsOptions), (req, res, next) => {
  res.json({ message: "This route is CORS-enabled for an allowed origin." });
});

app.use(express.json());
app.use(cors());
app.use(mongoSanitize({}));
app.use(compression());
//app.use(xss)
var organizerRouter = require("./routes/organizer.routes");
app.use(organizerRouter);

var eventRouter = require("./routes/event.routes");
app.use(eventRouter);

var categoryRouter = require("./routes/category.routes");
app.use(categoryRouter);

var emailRouter = require("./routes/email.routes");
app.use(emailRouter);

const authRouter = require("./routes/auth.routes");
app.use(authRouter);

const crawlerRouter = require("./routes/crawler.routes");
app.use(crawlerRouter);

const settingsRouter = require("./routes/settings.routes");
app.use(settingsRouter);

const storeDatasetRouter = require("./routes/storeDataset.routes");
app.use(storeDatasetRouter);

app.set("trust proxy", 1);

// startup our app at http://localhost:3000

var fileRouter = require("./routes/file.routes");
app.use(fileRouter);

app.listen(port, () =>
  console.log(`Evento backend listening on port ${port}!`)
);
