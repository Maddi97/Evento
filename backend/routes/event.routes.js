var express = require('express');
var router = express.Router();
const auth = require("../middleware/authJWT");
const limiter = require("../middleware/rateLimiter")
const Event = require("../model/event.model")


router.get('/events', limiter, (req, res) => {
    Event.find({})
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
})

router.get('/events/:eventId', limiter, (req, res) => {
    Event.find({ _id: req.params.eventId })
        .then((event) => res.send(event))
        .catch((error) => console.log(error))
});

router.get('/organizer/:organizerId/events', limiter, (req, res) => {
    Event.find({ _organizerId: req.params.organizerId })
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});


router.post('/eventOnDate', limiter, (req, res) => {
    let date = req.body.date
    Event.find(
        {
            $and: [
                {
                    'date.start': { $lte: date }  //-1 um den heutigen Tag mit zu finden
                },
                {
                    'date.end': { $gte: date }
                }
            ]
        }
    )
        .then((events) => {
            res.send(events);
        })
        .catch((error) => console.log(error))
});

router.post('/eventOnDateCatAndSubcat', limiter, (req, res) => {
    let date = new Date(req.body.fil.date)
    let categories = req.body.fil.cat
    let limit = req.body.fil.limit
    let userPosition = req.body.fil.currentPosition

    //get ids bc we filter by id
    let catIds = []
    categories.forEach(cat => catIds.push(cat._id))

    let subcategories = req.body.fil.subcat
    let subcatIds = []
    subcategories.forEach(sub => subcatIds.push(sub._id))
    if (date == "Invalid Date") {
        return;
    }
    Event.find(
        {
            $and: [
                {
                    $or: [
                        {
                            $and:
                                [
                                    {
                                        'date.start': { $lte: date }  //-1 um den heutigen Tag mit zu finden
                                    },
                                    {
                                        'date.end': { $gte: date }
                                    },
                                ],
                        },
                        {
                            permanent: { $eq: true }
                        },
                    ]
                },

                { 'category._id': { $in: catIds } },

            ]
        }
    ).then((events) => {
        // events contains all events filtered by date and category, based on this here we filter on the subcategory
        events = events.filter(event => {
            if (subcategories.length > 0) {
                r = false
                event.category.subcategories.forEach(sub => {
                    if (subcatIds.includes(sub._id)) {
                        r = true
                    }
                })
                return r
            } else return true
        })

        //sort events by distance
        events.sort((ev1, ev2) => {
            // Check if ev1 should be promoted (promote == true) and ev2 should not
            if (ev1.promotion && !ev2.promotion) {
                return -1; // ev1 comes before ev2
            }
            // Check if ev2 should be promoted (promote == true) and ev1 should not
            else if (!ev1.promotion && ev2.promotion) {
                return 1; // ev2 comes before ev1
            }
            // If neither should be promoted, compare by distance
            else {
                const distance1 = get_distance([ev1.geoData.lat, ev1.geoData.lon], userPosition);
                const distance2 = get_distance([ev2.geoData.lat, ev2.geoData.lon], userPosition);
                return distance1 - distance2;
            }
        });
        // Return events from offset to limit to not load all at once

        res.send(events.slice(0, limit));
    })
        .catch((error) => console.log(error))
});


router.post('/upcomingEvents', limiter, (req, res) => {
    let date = new Date(req.body.date)
    Event.find(
        {
            $or: [
                {
                    'date.start': { $gte: date }  //-1 um den heutigen Tag mit zu finden
                },
                {
                    $and: [
                        {
                            'date.start': { $lte: date }  //-1 um den heutigen Tag mit zu finden
                        },
                        {
                            'date.end': { $gte: date }
                        }
                    ]
                }
            ]
        }
    )

        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});
router.post('/outdatedEvents', limiter, (req, res) => {
    let date = new Date()
    Event.find(
        {

            'date.end': { $lte: date }
        })
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});

router.post('/checkIfEventExists', limiter, (req, res) => {
    const start = new Date(req.body.event.date.start).getTime()
    const end = new Date(req.body.event.date.end).getTime()
    const event = new Event(req.body.event)
    const name = event.name
    const organizerName = event.organizerName

    const oneDayInMillis = 24 * 60 * 60 * 1000; // One day in milliseconds
    const startMinus1 = new Date(start - oneDayInMillis);
    const endMinus1 = new Date(end - oneDayInMillis);
    const startPlus1 = new Date(start + oneDayInMillis);
    const endPlus1 = new Date(end + oneDayInMillis);

    Event.find(
        {
            name: { $regex: name, $options: 'i' },
            organizerName: organizerName,
            $or: [
                {
                    $and: [
                        {
                            'date.start': { $gte: startMinus1, $lte: startPlus1 }
                        },
                        {
                            'date.end': { $gte: endMinus1, $lte: endPlus1 }
                        }
                    ],
                },
                {
                    permanent: true
                },
                {
                    permanent: !event.permanent
                }
            ]
        }
    )
        .then((events) => { console.log(events); res.send(events) })
        .catch((error) => console.log(error))
});


router.post('/getEventsOnCategory', limiter, (req, res) => {
    const id = String(req.body.category._id)
    Event.find({ "category._id": id })
        .then((events) => {
            res.send(events);
        })
        .catch((error) => console.log(error))
})

router.post('/getActualEventsOnCategory', limiter, (req, res) => {
    let date = new Date()
    const id = String(req.body.category._id)
    Event.find(
        {
            $and: [
                {
                    "category._id": id
                },
                {
                    $or: [
                        {
                            'date.start': { $gte: date }  //-1 um den heutigen Tag mit zu finden
                        },
                        {
                            $and: [
                                {
                                    'date.start': { $lte: date }  //-1 um den heutigen Tag mit zu finden
                                },
                                {
                                    'date.end': { $gte: date }
                                }
                            ]
                        },
                        {
                            permanent: { $eq: true }
                        },
                    ]
                }
            ]
        }
    )
        .then((events) => {
            console.log(events)
            res.send(events);
        })
        .catch((error) => console.log(error))
})


router.post('/organizer/:organizerId/events', limiter, auth, (req, res) => {
    (new Event(req.body.event))
        .save()
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});

router.get('/organizer/:organizerId/events/:eventId', limiter, (req, res) => {
    const orgId = String(req.params.organizerId)
    const eventId = String(req.params.eventId)
    Event.findOne({ _organizerId: orgId, _id: eventId })
        .then((event) => res.send(event))
        .catch((error) => console.log(error))
});

router.patch('/organizer/:organizerId/events/:eventId', limiter, auth, (req, res) => {
    const orgId = String(req.params.organizerId)
    const eventId = String(req.params.eventId)
    const event = new Event(req.body.event)
    Event.findOneAndUpdate(
        { _organizerId: orgId, _id: eventId },
        { $set: event }, { new: true }
    )
        .then((event) => res.send(event))
        .catch((error) => console.log(error));
});

router.delete('/organizer/:organizerId/events/:eventId', limiter, auth, (req, res) => {
    const orgId = String(req.params.organizerId)
    const eventId = String(req.params.eventId)
    Event.findOneAndDelete({ _organizerId: orgId, _id: eventId })
        .then((event) => res.send(event))
        .catch((error) => console.log(error))
});

router.post('/deleteOutdatedEvents', limiter, auth, async (req, res) => {
    try {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        console.log(thirtyDaysAgo)
        // Find events with 'start' and 'end' before thirtyDaysAgo
        const outdatedEvents = await Event.find({
            $and: [
                { 'date.end': { $lt: thirtyDaysAgo } },
                {
                    permanent: { $eq: false }
                }
            ]
        });
        console.log(outdatedEvents)
        await Event.deleteMany({ _id: { $in: outdatedEvents.map(event => event._id) } });
        console.log(outdatedEvents)

        res.status(200).json({ outdatedEvents });
    }
    catch (error) {
        console.error('Error deleting outdated events:', error);
        res.status(500).json({ message: 'Error deleting outdated events' });
    }
})

// Todo refactor to other location
function get_distance(startPosition, endPosition) {
    const lat1 = startPosition[0];
    const lon1 = startPosition[1];

    const lat2 = endPosition[0];
    const lon2 = endPosition[1];

    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    } else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }

        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515 * 1.609344;
        return dist;
    }
}


module.exports = router;
