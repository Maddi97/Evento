const config = require("../config/auth.config");
const User = require("../model/user.model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  const user = new User({
    username: String(req.query.username),
    email: String(req.query.email),
    password: bcrypt.hashSync(req.query.password, 16),
  });
  console.log("___________________________________");
  console.log("signup");
  console.log("username", user.username);
  console.log("mail", user.email);
  console.log("password", user.password);
  console.log("___________________________________");

  user
    .save()
    .then(() => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

exports.signin = (req, res) => {
  console.log("___________________________________");
  console.log("signin");
  console.log("username", String(req.body.username));
  console.log("___________________________________");

  User.findOne({
    username: String(req.body.username),
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ user_id: user._id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token,
      });
      console.log("Sign in res:", user._id, user.username, user.email, token);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      console.log("Signin Error: ", err);
      return;
    });
};
