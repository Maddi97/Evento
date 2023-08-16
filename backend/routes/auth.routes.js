const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
const signUpKey = require("../config/auth.config")
const { sign } = require("crypto");
const express = require("express");
const limiter = require("../middleware/rateLimiter")
var router = express.Router();

router.post(
    `/signup`,
    limiter,
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signup
);
router.post("/signin", limiter, controller.signin);

module.exports = router;
