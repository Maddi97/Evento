var express = require('express');
var router = express.Router();
const Event = require("../model/event.model")


router.get('/events', (req, res) =>{
    Event.find({})
    .then((events)=> res.send(events))
    .catch((error) =>console.log(error))
})

router.get('/organizer/:organizerId/events', (req, res) => {
    Event.find({_organizerId: req.params.organizerId})
    .then((events) => res.send(events))
    .catch((error) => console.log(error))
});


router.post('/eventOnDate', (req, res) => {
    date = new Date(req.body.date)
    console.log(date.setDate(date.getDate()))
    Event.find(
        {
           $and: [
                {
                    'date.start': { $lte: new Date() }  //-1 um den heutigen Tag mit zu finden
                },
                {
                    'date.end':  { $gte: new Date() }
                }
            ]
    }
    )
    .then((events) => {
        res.send(events);
        console.log('Events: '+events)
    })
    .catch((error) => console.log(error))
});


router.get('/upcomingEvents', (req, res) => {
    Event.find(
        {
            $or: [
                {
                    'date.start': { $gte: new Date() }  //-1 um den heutigen Tag mit zu finden
                },
                {
                    $and: [
                        {
                            'date.start': { $lte: new Date() }  //-1 um den heutigen Tag mit zu finden
                        },
                        {
                            'date.end':  { $gte: new Date() }
                        }
                    ]
                }
            ]
        }
        )

    .then((events) => res.send(events))
    .catch((error) => console.log(error))
});


router.post('/getEventsOnCategory', (req, res) =>{
    const id = req.body.category._id
    console.log(req.body.category._id)
    Event.find({ "category._id": { id } } )
        .then((events)=> {
            res.send(events);
            console.log(events)
        })
        .catch((error) =>console.log(error))
})

router.get('/organizer/:organizerId/upcomingEvents', (req, res) => {

    today = new Date()
    Event.find(
        {'date.start':
                {$gte : today.setDate(today.getDate() - 1)}
        }  //-1 um den heutigen Tag mit zu finden
        )

    .then((events) => res.send(events))
    .catch((error) => console.log(error))
});


  
router.post('/organizer/:organizerId/events', (req, res) => {
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
  
router.patch('/organizer/:organizerId/events/:eventId', (req, res) => {
    Event.findOneAndUpdate(
      { _organizerId: req.params.organizerId, _id: req.params.eventId },
      { $set: req.body.event }, { new: true}
    )
      .then((event) => res.send(event))
      .catch((error) => console.log(error));
});
  
router.delete('/organizer/:organizerId/events/:eventId', (req, res) => {
    Event.findOneAndDelete({_organizerId: req.params.organizerId, _id: req.params.eventId})
    .then((event) => res.send(event))
    .catch((error) => console.log(error))
});

module.exports = router;