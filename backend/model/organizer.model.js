const mongoose = require('mongoose')

const OrganizerSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3
    }
});

const Organizer = mongoose.model('Organizer', OrganizerSchema);

module.exports = Organizer;