const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  _organizerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  organizerName: {
    type: String,
    required: true,
  },

  address: {
    plz: {
      type: String,
      minlength: 5,
    },
    street: {
      type: String,
      minlength: 2,
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

  category: {
    _id: {
      type: String,
    },
    name: {
      type: String,
    },
    iconTemporaryURL: {},
    iconPath: {
      type: String,
    },
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
        iconTemporaryURL: {},
        stockImagePath: {
          type: String,
        },
        stockTemporaryURL: {},
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

  price: {
    type: String,
  },

  date: {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
  },
  frequency: {
    type: mongoose.Schema.Types.Mixed,
    default: undefined,
  },
  coordinates: {
    lat: {
      type: String,
    },
    lon: {
      type: String,
    },
  },

  permanent: {
    type: Boolean,
  },
  hasUnkownOpeningTimes: {
    type: Boolean,
  },
  hot: {
    type: Boolean,
  },
  promotion: {
    type: Boolean,
  },
  times: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
  },
  eventImagePath: {
    type: String,
  },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
