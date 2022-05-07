// modules =================================================
const express = require('express');
// set our port
const port = 3000;
const app = express();
var cors = require('cors')

// configuration ===========================================
const mongoose = require("./config/mongoose")

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:4200',
    'http://localhost:4201',
    'https://insert.evento-leipzig.de',
    'https://evento-leipzig.de',
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
};

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res, next) => {
    res.json({message: 'This route is CORS-enabled for an allowed origin.'});
});

app.use(express.json())
app.use(cors())

var organizerRouter = require('./routes/organizer.routes')
app.use(organizerRouter)

var eventRouter = require('./routes/event.routes')
app.use(eventRouter)

var categoryRouter = require('./routes/category.routes')
app.use(categoryRouter)

var emailRouter = require('./routes/email.routes')
app.use(emailRouter)

const authRouter = require('./routes/auth.routes');
app.use(authRouter)

// startup our app at http://localhost:3000

var fileRouter = require('./routes/file.routes')
app.use(fileRouter)

app.listen(port, () =>
    console.log(`3vents51 backend listening on port ${port}!`)
);
