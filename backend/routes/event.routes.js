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


router.get('/eventOnDate', (req, res) => {
    console.log(req.params)
    date = new Date(req.body.date)
    Event.find(
       {date: { $gte: date.setDate(date.getDate() - 1), $lte: date.setDate(date.getDate() +1) } } //-1 um den heutigen Tag mit zu finden
        )

    .then((events) => res.send(events))
    .catch((error) => console.log(error))
});


router.get('/upcomingEvents', (req, res) => {
    today = new Date()
    Event.find(
       {date: {$gte : today.setDate(today.getDate() - 1)} }  //-1 um den heutigen Tag mit zu finden
        )

    .then((events) => res.send(events))
    .catch((error) => console.log(error))
});



router.get('/organizer/:organizerId/upcomingEvents', (req, res) => {

    today = new Date()
    Event.find(
       {date: {$gte : today.setDate(today.getDate() - 1)} }  //-1 um den heutigen Tag mit zu finden
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
    Event.findOneAndUpdate({_organizerId: req.params.organizerId, _id: req.params.eventId}, {$set: req.body})
    .then((event) => res.send(event))
    .catch((error) => console.log(error))
});
  
router.delete('/organizer/:organizerId/events/:eventId', (req, res) => {
    Event.findOneAndDelete({_organizerId: req.params.organizerId, _id: req.params.eventId})
    .then((event) => res.send(event))
    .catch((error) => console.log(error))
});

module.exports = router;