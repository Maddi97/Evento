var express = require('express');
var router = express.Router();

server.get("/search", async (request, response) => {

    try {

        let result = await collection.aggregate([

            {

                "$search": {

                    "autocomplete": {

                        "query": `${request.query.query}`,

                        "path": "name",

                        "fuzzy": {

                            "maxEdits": 2,

                            "prefixLength": 3

                        }

                    }

                }

            }

        ]).toArray();

        response.send(result);

    } catch (e) {

        response.status(500).send({ message: e.message });

    }

});

module.exports = router;