const mongoose = require('mongoose')

const OrganizerSchema = new mongoose.Schema({
    title: {
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
        }
    }
});

const Organizer = mongoose.model('Organizer', OrganizerSchema);

module.exports = Organizer;