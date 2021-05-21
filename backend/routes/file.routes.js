
var crypto = require("crypto");
var express = require("express");
var router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${crypto.randomBytes(10).toString("hex")}_${Date.now()}_${
        file.originalname
      }`
    );
  }
})

const upload = multer({ storage });

router.post('/uploadFile', upload.single('file'), function (req, res, next) {
      const file = req.file
       if(file){
         res.json(file)
       } else {
         throw new Error("File upload unsuccessfull")
       }
  });  

module.exports = router;