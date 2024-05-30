var express = require("express");
var router = express.Router();
const auth = require("../middleware/authJWT");

router.post("/storeLinklist", auth, (req, res) => {
  const url = req.body.url;
  const linklist = req.body.linklist;
  console.log(url);
});

module.exports = router;
