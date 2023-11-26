
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
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/getTaskResultsOfRobot', limiter, auth, async (req, res) => {
    try {
        const { robotId, taskId } = req.body;
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
        console.log(error)
        const { messageCode } = error?.response?.data
        res.send(messageCode)
        }    
});
router.post('/getTasksOfRobot', limiter, auth, async (req, res) => {
    try {
        const { robotId } = req.body;
        const options = {
            method: 'GET',
            url: `https://api.browse.ai/v2/robots/${robotId}/tasks/`,
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            },
        };
        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data.result);
    } catch (error) {
        const { messageCode } = error?.response?.data
        res.send(messageCode)
        }    
});
router.post('/getBulkRunsOfRobot', limiter, auth, async (req, res) => {
    try {
        const { robotId } = req.body;
        console.log(`https://api.browse.ai/v2/robots/${robotId}/bulk-runs`,)
        const options = {
            method: 'GET',
            url: `https://api.browse.ai/v2/robots/${robotId}/bulk-runs`,
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            },
        };
        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data.result);
    } catch (error) {
        const { messageCode } = error?.response?.data
        res.send(messageCode)
        }    
});

router.post('/getBulkTaskOfRobot', limiter, auth, async (req, res) => {
    try {
        const { robotId, taskId } = req.body;
        const options = {
            method: 'GET',
            url: `https://api.browse.ai/v2/robots/${robotId}/bulk-runs/${taskId}`,
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            },
        };
        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data.result);
    } catch (error) {
        const { messageCode } = error?.response?.data
        res.send(messageCode)
        }    
});

router.post('/runTaskOfRobot', limiter, auth, async (req, res) => {
    try {
        const { robotId, originUrl } = req.body;
        const data = JSON.stringify({
        "recordVideo": false,
        "inputParameters": {
            "originUrl": originUrl,
        }
    })
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
        const { messageCode } = error?.response?.data
            res.send(messageCode)
    }
});

router.post('/runBulkTaskOfRobot', limiter, auth, async (req, res) => {
    try {
        const { robotId, inputParameters } = req.body;
        const data = JSON.stringify({
        "recordVideo": false,
        "inputParameters": inputParameters
    })
        const options = {
            method: 'POST',
            url: `https://api.browse.ai/v2/robots/${robotId}/bulk-runs`,
            headers: {
                Authorization: `Bearer ${browseAiApiKey}`,
            },
            data
        };
        const response = await axios(options);
        res.status(response.data.statusCode).send(response.data);
    } catch (error) {
        const { messageCode } = error?.response?.data
            res.send(messageCode)
    }
});



module.exports = router;
