const User = require("../model/user.model");

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).then((user) => {

        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }
        // Email
        User.findOne({
            email: req.body.email
        }).then((user) => {
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }
            next();
        });
    }).catch((err) => {
        res.status(500).send({ message: err });
        return;
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};
module.exports = verifySignUp;

