var crypto = require("crypto");
var express = require("express");
var router = express.Router();
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const limiter = require('../middleware/rateLimiter')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `temp_dir`;
        fs.mkdirSync(path, { recursive: true });
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
                `${crypto.randomBytes(10).toString("hex")}_${Date.now()}_${file.originalname
                }`
            );
        }
    }
})

const upload = multer({ storage });

router.post('/uploadCategoryFiles', upload.array('files'), limiter, function (req, res, next) {

    destinationIcon = req.body.file_path
    let icon = undefined
    //in case update updates only stockImage the Icon stays undefined
    if (destinationIcon !== undefined) {
        icon = req.files[0]
    }

    destinationStockImage = req.body.stockImagePath
    let stockImage = undefined
    //case both are updated
    if (destinationStockImage !== undefined && destinationIcon !== undefined) {
        stockImage = req.files[1]
    }
    if (destinationStockImage !== undefined && destinationIcon === undefined) {
        stockImage = req.files[0]
    }
    //check if dest path exists otherwise create

    if (icon !== undefined && stockImage === undefined) {
        fs.mkdirSync(destinationIcon, { recursive: true });
        //move icon from temp dir to destination

        fs.copyFile(icon.path,
            destinationIcon + '/' + icon.filename,
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(icon.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            icon.path = destinationIcon + "/" + icon.filename
                            res.json({ 'icon': icon, 'stockImage': stockImage });
                        }
                    )
                }

            });
    }

    if (stockImage !== undefined && icon === undefined) {
        fs.mkdirSync(destinationStockImage, { recursive: true });
        //move icon from temp dir to destination
        fs.copyFile(
            stockImage.path,
            destinationStockImage + '/' + stockImage.filename,
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(stockImage.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            stockImage.path = destinationStockImage + "/" + stockImage.filename
                            res.json({ 'icon': icon, 'stockImage': stockImage });
                        }
                    )
                }

            }
        );
    }
    if (icon !== undefined && stockImage !== undefined) {
        //check if dest path exists otherwise create
        fs.mkdirSync(destinationIcon, { recursive: true });
        //move icon from temp dir to destination
        fs.copyFile(
            icon.path,
            destinationIcon + '/' + icon.filename,
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(icon.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            icon.path = destinationIcon + "/" + icon.filename
                        }
                    )
                }
            }
        );

        fs.mkdirSync(destinationStockImage, { recursive: true });

        //move icon from temp dir to destination
        fs.copyFile(
            stockImage.path,
            destinationStockImage + '/' + stockImage.filename,
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(stockImage.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            stockImage.path = destinationStockImage + "/" + stockImage.filename
                            res.json({ 'icon': icon, 'stockImage': stockImage });
                        }
                    )
                }

            }
        );
    }

});


router.post('/uploadEventImage', upload.array('files'), limiter, function (req, res, next) {

    const destinationEventImage = req.body.eventImagePath
    const eventImage = req.files[0]

    fs.mkdirSync(destinationEventImage, { recursive: true });

    //move icon from temp dir to destination
    fs.copyFile(
        eventImage.path,
        destinationEventImage + '/' + eventImage.filename,
        function (err) {
            if (err) {
                return console.error(err);
            } else {
                fs.rm(eventImage.path,
                    function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        eventImage.path = destinationEventImage + "/" + eventImage.filename
                        res.json({ 'eventImage': eventImage });
                    }
                )
            }

        }
    );
}
)


router.post('/uploadOrganizerImage', upload.array('files'), limiter, function (req, res, next) {

    const destinationOrganizerImage = req.body.organizerImagePath
    const organizerImage = req.files[0]

    fs.mkdirSync(destinationOrganizerImage, { recursive: true });


    //move icon from temp dir to destination
    fs.copyFile(
        organizerImage.path,
        destinationOrganizerImage + '/' + organizerImage.filename,
        function (err) {
            if (err) {
                return console.error(err);
            } else {
                fs.rm(organizerImage.path,
                    function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        organizerImage.path = destinationOrganizerImage + "/" + organizerImage.filename
                        res.json({ 'organizerImage': organizerImage });
                    }
                )
            }
        }
    );
}
)

router.post('/downloadFile', limiter, function (req, res, next) {
    const dest = req.body.path
    res.download(dest)
})

module.exports = router;
