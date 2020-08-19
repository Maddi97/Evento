const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3
    },
    _organizerId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;