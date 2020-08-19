var express = require('express');
var router = express.Router();
const Organizer = require("../model/organizer.model")

router.get('/organizer', (req, res) => {
    Organizer.find({})
    .then(organizer => res.send(organizer))
    .catch(error => console.log(error))
});
  
router.post('/organizer', (req, res) => {
    (new Organizer({'title': req.body.title}))
    .save()
    .then((organizer) => res.send(organizer))
    .catch((error) => console.log(error))
});
  
router.get('/organizer/:organizerId', (req, res) => {
    Organizer.find( { _id: req.params.organizerId })
    .then((organizer) => res.send(organizer))
    .catch((error) => console.log(error))
})
  
router.delete('/organizer/:organizerId', (req, res) => {
    Organizer.findByIdAndDelete({_id: req.params.organizerId})
    .then((organizer) => res.send(organizer))
    .catch((error => console.log(error)))
});

module.exports = router