var crypto = require("crypto");
var express = require("express");
var router = express.Router();
const multer = require('multer');
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `temp_dir`;
        fs.mkdirSync(path, {recursive: true});
        cb(null, path);
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            var err = new Error()
            err.code = 'filetype';
            return cb(err)

        } else {
            cb(
                null,
                `${crypto.randomBytes(10).toString("hex")}_${Date.now()}_${
                    file.originalname
                }`
            );
        }
    }
})

const upload = multer({storage});

router.post('/uploadCategoryFiles', upload.array('files'), function (req, res, next) {
    const icon = req.files[0]
    const stockImage = req.files[1]
    destinationIcon = req.body.file_path
    destinationStockImage = req.body.stockImagePath
    //check if dest path exists otherwise create
    fs.mkdirSync(destinationIcon, {recursive: true});
    //move icon from temp dir to destination
    fs.rename(
        icon.path,
        destinationIcon + '/' + icon.filename,
        function (err) {
            if (err) {
                return console.error(err);
            }
            icon.path = destinationIcon + "/" + icon.filename
        }
    );

    fs.mkdirSync(destinationStockImage, {recursive: true});


    //move icon from temp dir to destination
    fs.rename(
        stockImage.path,
        destinationStockImage + '/' + stockImage.filename,
        function (err) {
            if (err) {
                return console.error(err);
            }
            stockImage.path = destinationStockImage + "/" + stockImage.filename
            res.json({'icon': icon, 'stockImage': stockImage});
        }
    );

});

router.post('/downloadFile', function (req, res, next) {
    dest = req.body.path
    res.download(dest)
})

module.exports = router;