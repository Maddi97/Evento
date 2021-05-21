var express = require("express");
var router = express.Router();
const multer = require('multer');

var DIR = './uploads/';

var upload = multer({dest: DIR}).single('file');




router.post('/uploadFile', function (req, res, next) {
     upload(req, res, function (err) {   
        if (err) {
          // An error occurred when uploading
          console.log(err);
          return res.status(422).send("an Error occured")
        }  
       // No error occured.
        return res.send(req.file); 
  });  
})

module.exports = router;