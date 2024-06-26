var express = require("express");
var router = express.Router();
const auth = require("../middleware/authJWT");
const limiter = require("../middleware/rateLimiter");
const Event = require("../model/event.model");
const timeHelper = require("../helpers/timeAndDate.helper");
const Category = require("../model/category.model"); // Import the Category model

router.get("/events", limiter, (req, res) => {
  Event.find({})
    .then((events) => res.send(events))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.get("/events/:eventId", limiter, (req, res) => {
  Event.find({ _id: req.params.eventId })
    .then((event) => res.send(event))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.get("/frequentEvents", limiter, (req, res) => {
  Event.find({ frequency: { $exists: true } })
    .then((event) => res.send(event))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});
router.get("/organizer/:organizerId/events", limiter, (req, res) => {
  Event.find({ _organizerId: req.params.organizerId })
    .then((events) => res.send(events))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/eventOnDate", limiter, (req, res) => {
  let date = req.body.date;
  Event.find({
    $or: [
      {
        $and: [
          {
            "date.start": { $lte: date }, //-1 um den heutigen Tag mit zu finden
          },
          {
            "date.end": { $gte: date },
          },
        ],
      },
      {
        $and: [
          { frequency: { $exists: true } },
          {
            "date.start": { $lte: date }, //-1 um den heutigen Tag mit zu finden
          },
        ],
      },
    ],
  })
    .then((events) => {
      events = events.filter((event) => {
        if (event.frequency) {
          return (
            // frequency has always to go until the next day
            timeHelper.isFrequencyToday(event.frequency, date)
          );
        } else {
          return true;
        }
      });
      res.send(events);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/eventOnDateCatAndSubcat", limiter, (req, res) => {
  try {
    let date = req.body.date;
    let categoryIds = req.body.cat;
    let alreadyReturnedEventIds = req.body.alreadyReturnedEventIds || [];
    let limit = req.body.limit;
    let userPosition = req.body.currentPosition;

    let subcategoryIds = req.body.subcat;
    if (date == "Invalid Date") {
      res.status(500).json({ error: "Invalid Date Error" });
      return; // Send an error response with status code 500 (Internal Server Error)
    }
    if (!userPosition) {
      res.status(500).json({ error: "No user position" });
      return;
    }

    Event.find({
      $and: [
        {
          $or: [
            {
              $and: [
                {
                  "date.start": { $lte: date },
                },
                {
                  "date.end": { $gte: date },
                },
              ],
            },
            {
              permanent: { $eq: true },
            },
            {
              $and: [
                { frequency: { $exists: true } },
                {
                  "date.start": { $lte: date }, //-1 um den heutigen Tag mit zu finden
                },
              ],
            },
          ],
        },

        { "category._id": { $in: categoryIds } },
      ],
    }).then((events) => {
      // events contains all events filtered by date and category, based on this here we filter on the subcategory
      events = events.filter((event) => {
        return subcategoryIds.every((subcat) =>
          event.category.subcategories
            .map((subcategory) => subcategory._id)
            .includes(subcat)
        );
      });
      //filter events of end day that are already over
      events = events.filter((event) => {
        if (event.frequency) {
          return timeHelper.isFrequencyToday(event.frequency, date);
        }
        return true;
      });
      //sort out already returned events
      events = events.filter((event) => {
        return !alreadyReturnedEventIds.includes(event._id.toString());
      });
      //sort events by distance
      events.sort((ev1, ev2) => {
        // Check if ev1 should be promoted (promote == true) and ev2 should not
        if (ev1.promotion && !ev2.promotion) {
          return -1; // ev1 comes before ev2
        }
        // Check if ev2 should be promoted (promote == true) and ev1 should not
        else if (!ev1.promotion && ev2.promotion) {
          return 1; // ev2 comes before ev1
        }
        // If neither should be promoted, compare by distance
        else {
          const [aHours, aMinutes] = ev1.times?.start
            ?.split(":")
            .map(Number) || [0, 0];
          const [bHours, bMinutes] = ev2.times?.start
            ?.split(":")
            .map(Number) || [0, 0];

          // Compare hours first, then minutes
          if (aHours !== bHours) {
            return aHours - bHours;
          } else {
            return aMinutes - bMinutes;
          }
        }
      });
      // Return events from offset to limit to not load all at once

      res.send(events.slice(0, limit));
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error in events route", error });
  }
});

router.post("/upcomingEvents", limiter, (req, res) => {
  let date = new Date(req.body.date);
  Event.find({
    $or: [
      {
        "date.start": { $gte: date }, //-1 um den heutigen Tag mit zu finden
      },
      {
        $and: [
          {
            "date.start": { $lte: date }, //-1 um den heutigen Tag mit zu finden
          },
          {
            "date.end": { $gte: date },
          },
        ],
      },
    ],
  })

    .then((events) => res.send(events))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/hotEvents", limiter, (req, res) => {
  let date = new Date(req.body.date);
  let count = req.body.count || 0;
  let limit = req.body.limit || 99999;
  Event.find({
    $and: [
      {
        $or: [
          {
            "date.start": { $gte: date },
          },
          {
            $and: [
              {
                "date.start": { $lte: date }, //-1 um den heutigen Tag mit zu finden
              },
              {
                "date.end": { $gte: date },
              },
            ],
          },
        ],
      },
      { hot: { $eq: true } },
    ],
  })

    .then((events) => res.send(events.slice(count, limit)))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/getEventsBySearchString", limiter, async (req, res) => {
  try {
    const searchString = String(escape(req.body.searchString)); // Get the searchString from the request body
    const limit = Number(req.body.limit);
    let categories = await Category.find({}, "_id");
    categories = categories.map((catIdObj) => catIdObj._id); //map category id object to list of ids
    const date = req.body.date;
    let alreadyReturnedEventIds = req.body.alreadyReturnedEventIds || [];
    const fourteenDaysAhead = new Date(date);
    fourteenDaysAhead.setDate(fourteenDaysAhead.getDate() + 21);
    const dateConditions = {
      $or: [
        { "date.start": { $gte: date } },
        {
          $and: [
            { "date.start": { $lte: date } }, // -1 to include today
            { "date.end": { $gte: date } },
          ],
        },
        { permanent: true },
        {
          $and: [
            { frequency: { $exists: true } },
            { "date.start": { $lte: date } },
          ],
        },
      ],
    };

    const fourteenDaysAgoCondition = {
      "date.start": { $lte: fourteenDaysAhead },
    };

    const searchStringConditions = {
      $or: [
        { name: { $regex: searchString, $options: "i" } },
        { organizerName: { $regex: searchString, $options: "i" } },
        { "address.street": { $regex: searchString, $options: "i" } },
        { "category.name": { $regex: searchString, $options: "i" } },
        {
          alias: {
            $elemMatch: { $regex: searchString, $options: "i" },
          },
        },
      ],
    };

    const categoryConditions = { "category._id": { $in: categories } };

    Event.find({
      $and: [
        dateConditions,
        fourteenDaysAgoCondition,
        searchStringConditions,
        categoryConditions,
      ],
    })
      .then((events) => {
        events = events.filter((event) => {
          return !alreadyReturnedEventIds.includes(event._id.toString());
        });
        res.send(events.slice(0, limit));
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error Search in events route" });
  }
});

router.post("/outdatedEvents", limiter, (req, res) => {
  let date = new Date();
  date.setDate(date.getDate() - 30);

  Event.find({
    $and: [
      {
        "date.end": { $lte: date },
        permanent: false,
      },
    ],
  })
    .then((events) => res.send(events))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/checkIfEventExists", limiter, (req, res) => {
  const start = new Date(req.body.event.date.start).getTime();
  const end = new Date(req.body.event.date.end).getTime();
  const event = new Event(req.body.event);
  const name = event.name;
  const organizerName = event.organizerName;

  const oneDayInMillis = 24 * 60 * 60 * 1000; // One day in milliseconds
  const startMinus1 = new Date(start - oneDayInMillis);
  const endMinus1 = new Date(end - oneDayInMillis);
  const startPlus1 = new Date(start + oneDayInMillis);
  const endPlus1 = new Date(end + oneDayInMillis);

  Event.find({
    name: { $regex: name, $options: "i" },
    organizerName: organizerName,
    $or: [
      {
        $and: [
          {
            "date.start": { $gt: startMinus1, $lt: startPlus1 },
          },
          {
            "date.end": { $gt: endMinus1, $lt: endPlus1 },
          },
        ],
      },
      {
        permanent: true,
      },
      {
        permanent: !event.permanent,
      },
    ],
  })
    .then((events) => {
      res.send(events);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/getEventsOnCategory", limiter, (req, res) => {
  const id = String(req.body.category._id);
  Event.find({ "category._id": id })
    .then((events) => {
      res.send(events);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});
router.post(
  "/getUpcomingventsOnCategoryAndSubcategory",
  limiter,
  (req, res) => {
    let date = req.body.date;
    const id = String(req.body.subcategory._id);
    Event.find({
      $or: [
        {
          "date.start": { $gte: date },
        },
        {
          $and: [
            {
              "date.start": { $lte: date },
            },
            {
              "date.end": { $gte: date },
            },
          ],
        },
        {
          permanent: { $eq: true },
        },
        {
          $and: [
            { frequency: { $exists: true } },
            {
              "date.start": { $lte: date },
            },
          ],
        },
      ],
    })
      .then((events) => {
        res.send(
          events.filter((event) =>
            event.category.subcategories
              .map((subcategory) => subcategory._id)
              .includes(id)
          )
        );
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
      });
  }
);

router.post("/getUpcomingventsOnCategory", limiter, (req, res) => {
  const date = req.body.date;
  const id = String(req.body.category._id);
  Event.find({
    $and: [
      {
        "category._id": id,
      },
      {
        $or: [
          {
            "date.start": { $gte: date },
          },
          {
            $and: [
              {
                "date.start": { $lte: date },
              },
              {
                "date.end": { $gte: date },
              },
            ],
          },
          {
            permanent: { $eq: true },
          },
          {
            $and: [
              { frequency: { $exists: true } },
              {
                "date.start": { $lte: date },
              },
            ],
          },
        ],
      },
    ],
  })
    .then((events) => {
      res.send(events);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.post("/organizer/:organizerId/events", limiter, auth, (req, res) => {
  new Event(req.body.event)
    .save()
    .then((event) => res.status(201).json(event)) // Send a successful response with status code 201 (Created)
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.get("/organizer/:organizerId/events/:eventId", limiter, (req, res) => {
  const orgId = String(req.params.organizerId);
  const eventId = String(req.params.eventId);
  Event.findOne({ _organizerId: orgId, _id: eventId })
    .then((event) => res.send(event))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
    });
});

router.patch(
  "/organizer/:organizerId/events/:eventId",
  limiter,
  auth,
  (req, res) => {
    const orgId = String(req.params.organizerId);
    const eventId = String(req.params.eventId);
    const event = new Event(req.body.event);
    Event.findOneAndUpdate(
      { _organizerId: orgId, _id: eventId },
      { $set: event },
      { new: true }
    )
      .then((event) => res.send(event))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
      });
  }
);

router.delete(
  "/organizer/:organizerId/events/:eventId",
  limiter,
  auth,
  (req, res) => {
    const orgId = String(req.params.organizerId);
    const eventId = String(req.params.eventId);
    Event.findOneAndDelete({ _organizerId: orgId, _id: eventId })
      .then((event) => res.send(event))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Send an error response with status code 500 (Internal Server Error)
      });
  }
);

router.post("/deleteOutdatedEvents", limiter, auth, async (req, res) => {
  try {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    // Find events with 'start' and 'end' before thirtyDaysAgo
    const outdatedEvents = await Event.find({
      $and: [
        { "date.end": { $lt: thirtyDaysAgo } },
        {
          permanent: { $eq: false },
        },
      ],
    });
    await Event.deleteMany({
      _id: { $in: outdatedEvents.map((event) => event._id) },
    });

    res.status(200).json({ outdatedEvents });
  } catch (error) {
    console.error("Error deleting outdated events:", error);
    res.status(500).json({ message: "Error deleting outdated events" });
  }
});

// Todo refactor to other location
function get_distance(startPosition, endPosition) {
  const lat1 = startPosition[0];
  const lon1 = startPosition[1];

  const lat2 = endPosition[0];
  const lon2 = endPosition[1];

  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;
    return dist;
  }
}

module.exports = router;
