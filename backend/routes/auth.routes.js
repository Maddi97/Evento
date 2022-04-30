const {verifySignUp} = require("../middleware");
const controller = require("../controller/auth.controller");
const signUpKey = require("../config/auth.config")
const {sign} = require("crypto");
const express = require("express");
var router = express.Router();

router.post(
    `/signup`,
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signup
);
router.post("/signin", controller.signin);

module.exports = router;
