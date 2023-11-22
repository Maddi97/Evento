
var express = require('express');
const auth = require("../middleware/authJWT");
const axios = require('axios');
var router = express.Router();
const limiter = require("../middleware/rateLimiter")
const { browseAiApiKey } = require("../config/crawler.config")


router.get('/robots', limiter, auth, async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://api.browse.ai/v2/robots',
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            }
        };

        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/getTaskOfRobot', limiter, auth, async (req, res) => {
    const { robotId, taskId } = req.body;

    try {
        const options = {
            method: 'GET',
            url: `https://api.browse.ai/v2/robots/${robotId}/tasks/${taskId}`,
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            },
        };
        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data.result);
    } catch (error) {
        const { statusCode, messageCode } = error.response.data
        res.status(statusCode).send(messageCode);
    }
});

router.post('/runTaskOfRobot', limiter, auth, async (req, res) => {
    const { robotId, originUrl } = req.body;
    const data = JSON.stringify({
        "recordVideo": false,
        "inputParameters": {
            "originUrl": originUrl,
        }
    })
    try {
        const options = {
            method: 'POST',
            url: `https://api.browse.ai/v2/robots/${robotId}/tasks`,
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            },
            data
        };
        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data);
    } catch (error) {
        const { statusCode, messageCode } = error.response.data
        res.status(statusCode).send(messageCode);
    }
});



module.exports = router;
