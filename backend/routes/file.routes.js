
var crypto = require("crypto");
var express = require("express");
var router = express.Router();
const multer = require('multer');
const fs = require('fs')


const storage = multer.diskStorage({
  destination: function(req, file, cb){
    const path = `temp_dir`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
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
      destination = req.body.file_path

      //check if dest path exists otherwise create
      fs.mkdirSync(destination, { recursive: true });
      
      //move image from temp dir to destination
      fs.rename(
        file.path,
        destination + '/' + file.filename,
        function (err) {
          if (err) {
            return console.error(err);
          }
          file.path = destination + "/" + file.filename
          res.json(file);
        }
      );

  });  

module.exports = router;