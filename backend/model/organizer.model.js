const mongoose = require("mongoose");

const OrganizerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  alias: {
    type: [String],
  },

  address: {
    plz: {
      type: String,
      minlength: 5,
    },
    street: {
      type: String,
      minlength: 3,
    },
    city: {
      type: String,
      minlength: 3,
    },
    streetNumber: {
      type: String,
    },
    country: {
      type: String,
      minlength: 3,
    },
  },
  email: {
    type: String,
  },
  telephone: {
    type: String,
  },
  category: {
    _id: {
      type: String,
    },
    name: {
      type: String,
    },
    iconPath: {
      type: String,
    },
    iconTemporaryURL: {},
    stockImagePath: {
      type: String,
    },
    stockTemporaryURL: {},
    subcategories: [
      {
        _id: {
          type: String,
        },
        name: {
          type: String,
        },
        iconPath: {
          type: String,
        },
        iconTemporaryURL: {
          type: String,
        },
      },
    ],
  },
  description: {
    type: String,
    maxlength: 5000,
  },
  link: {
    type: String,
  },
  frequency: {
    type: Number,
  },
  lastUpdated: {
    type: Date,
  },
  openingTimes: [
    {
      day: {
        type: String,
      },
      start: {
        type: String,
      },
      end: {
        type: String,
      },
    },
  ],
  isEvent: {
    type: Boolean,
  },
  ifEventId: {
    type: String,
  },
  coordinates: {
    lat: {
      type: String,
    },
    lon: {
      type: String,
    },
  },
  organizerImagePath: {
    type: String,
  },
});

const Organizer = mongoose.model("Organizer", OrganizerSchema);

module.exports = Organizer;
