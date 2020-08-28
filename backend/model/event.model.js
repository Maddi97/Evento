const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    _organizerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    adress: {
        plz: {
            type: String,
            minlength: 5
        },
        street: {
            type: String,
            minlength: 2
        },
        city: {
            type: String,
            minlength: 3
        },
        streetNumber: {
            type: String,
            minlength: 1
        },
        country: {
            type: String,
            minlength: 3
        }
    },
    category: {
        type: String,
    },
    description: {
        type: String,
        maxlength: 200
    },

    date: {
        day: String,
        start: String,
        end: String,
    }

});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;