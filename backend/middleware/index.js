const authJwt = require("./authJwt");
const verifySignUp = require("../middleware/verifySignUp");
module.exports = {
    authJwt,
    verifySignUp
};
