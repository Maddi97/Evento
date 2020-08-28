const mongoose = require('mongoose')

const OrganizerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
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
    email: {
        type: String,
    },
    telephone: {
        type: String,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
        maxlength: 200
    },
    openingTimes: [{
        day: {
            type: String,
        },
        start: {
            type: String,
        },
        end: {
            type: String,
        },
    }],
});

const Organizer = mongoose.model('Organizer', OrganizerSchema);

module.exports = Organizer;