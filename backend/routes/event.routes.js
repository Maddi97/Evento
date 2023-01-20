var express = require('express');
var router = express.Router();
const auth = require("../middleware/authJWT");

const Event = require("../model/event.model")


router.get('/events', (req, res) => {
    Event.find({})
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
})

router.get('/events/:eventId', (req, res) => {
    Event.find({_id: req.params.eventId})
        .then((event) => res.send(event))
        .catch((error) => console.log(error))
});

router.get('/organizer/:organizerId/events', (req, res) => {
    Event.find({_organizerId: req.params.organizerId})
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});


router.post('/eventOnDate', (req, res) => {
    let date = req.body.date
    Event.find(
        {
            $and: [
                {
                    'date.start': {$lte: date}  //-1 um den heutigen Tag mit zu finden
                },
                {
                    'date.end': {$gte: date}
                }
            ]
        }
    )
        .then((events) => {
            res.send(events);
        })
        .catch((error) => console.log(error))
});

router.post('/eventOnDateCatAndSubcat', (req, res) => {
    let date = new Date(req.body.fil.date)
    let categories = req.body.fil.cat
    let permanent = true
    //get ids bc we filter by id
    let catIds = []
    categories.forEach(cat => catIds.push(cat._id))

    let subcategories = req.body.fil.subcat
    let subcatIds = []
    subcategories.forEach(sub => subcatIds.push(sub._id))


    Event.find(
        {
            $and: [
                {
                    $or: [
                        {
                            $and:
                                [
                                    {
                                        'date.start': {$lte: date}  //-1 um den heutigen Tag mit zu finden
                                    },
                                    {
                                        'date.end': {$gte: date}
                                    },
                                ],
                        },
                        {
                            permanent: {$eq: true}
                        },
                    ]
                },

                {'category._id': {$in: catIds}},

            ]
        }
    )
        .then((events) => {
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
            res.send(events);
        })
        .catch((error) => console.log(error))
});


router.post('/upcomingEvents', (req, res) => {
    let date = new Date(req.body.date)
    Event.find(
        {
            $or: [
                {
                    'date.start': {$gte: date}  //-1 um den heutigen Tag mit zu finden
                },
                {
                    $and: [
                        {
                            'date.start': {$lte: date}  //-1 um den heutigen Tag mit zu finden
                        },
                        {
                            'date.end': {$gte: date}
                        }
                    ]
                }
            ]
        }
    )

        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});


router.post('/getEventsOnCategory', (req, res) => {
    const id = String(req.body.category._id)
    Event.find({"category._id": id})
        .then((events) => {
            res.send(events);
        })
        .catch((error) => console.log(error))
})


router.post('/organizer/:organizerId/events', auth, (req, res) => {
    (new Event(req.body.event))
        .save()
        .then((events) => res.send(events))
        .catch((error) => console.log(error))
});

router.get('/organizer/:organizerId/events/:eventId', (req, res) => {
    Event.findOne({_organizerId: req.params.organizerId, _id: req.params.eventId})
        .then((event) => res.send(event))
        .catch((error) => console.log(error))
});

router.patch('/organizer/:organizerId/events/:eventId', auth, (req, res) => {
    Event.findOneAndUpdate(
        {_organizerId: req.params.organizerId, _id: req.params.eventId},
        {$set: req.body.event}, {new: true}
    )
        .then((event) => res.send(event))
        .catch((error) => console.log(error));
});

router.delete('/organizer/:organizerId/events/:eventId', auth, (req, res) => {
    Event.findOneAndDelete({_organizerId: req.params.organizerId, _id: req.params.eventId})
        .then((event) => res.send(event))
        .catch((error) => console.log(error))
});

module.exports = router;
