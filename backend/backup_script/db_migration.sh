docker exec -it mongodb mongosh
use db_evento;
show collections;

db.events.updateMany({}, { $rename: { "geoData": "coordinates" } });

db.events.updateMany(
  { "address.street": { $exists: true }, "address.streetNumber": { $exists: true } },
  [
    {
      $set: {
        "address.street": {
          $concat: ["$address.street", " ", "$address.streetNumber"]
        }
      }
    }
  ]
);