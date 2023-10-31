var crypto = require("crypto");
var express = require("express");
var router = express.Router();
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const limiter = require('../middleware/rateLimiter')
const sanitizeFilename = require('sanitize-filename'); // You can use the sanitize-filename package for additional validation

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
        destinationIcon = destinationIcon
        fs.mkdirSync(destinationIcon, { recursive: true });
        //move icon from temp dir to destination

        fs.copyFile(icon.path,
            path.join(destinationIcon, sanitizeFilename(icon.filename)),
            function (err) {
                console.log(err)
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(icon.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            icon.path = path.join(String(destinationIcon), icon.filename)
                            res.json({ 'icon': icon, 'stockImage': stockImage });
                        }
                    )
                }

            });
    }

    if (stockImage !== undefined && icon === undefined) {
        destinationStockImage = destinationStockImage

        fs.mkdirSync(destinationStockImage, { recursive: true });
        //move icon from temp dir to destination
        fs.copyFile(
            stockImage.path,
            path.join(destinationStockImage, sanitizeFilename(stockImage.filename)),
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(stockImage.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            stockImage.path = path.join(String(destinationStockImage), stockImage.filename)
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
            path.join(destinationIcon, sanitizeFilename(icon.filename)),
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    fs.rm(icon.path,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            icon.path = path.join(String(destinationIcon), icon.filename)
                        }
                    )
                }
            }
        );
        destinationStockImage = destinationStockImage

        fs.mkdirSync(destinationStockImage, { recursive: true });

        //move icon from temp dir to destination
        fs.copyFile(
            stockImage.path,
            path.join(destinationStockImage, stockImage.filename),
            function (err) {
                if (err) {
                    res.status(500).json({ message: 'File Service Error: ', err });
                    return console.error(err);
                } else {
                    fs.rm(stockImage.path,
                        function (err) {
                            if (err) {
                                res.status(500).json({ message: 'File Service Error: ', err });
                                return console.error(err);
                            }
                            stockImage.path = path.join(String(destinationStockImage), sanitizeFilename(stockImage.filename))
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
        path.join(destinationEventImage, sanitizeFilename(eventImage.filename)),
        function (err) {
            if (err) {
                res.status(500).json({ message: 'File Service Error: ', err });
                return console.error(err);
            } else {
                fs.rm(eventImage.path,
                    function (err) {
                        if (err) {
                            res.status(500).json({ message: 'File Service Error: ', err });
                            return console.error(err);
                        }
                        eventImage.path = path.join(String(destinationEventImage), eventImage.filename)
                        res.json({ 'eventImage': eventImage });
                    }
                )
            }

        }
    );
}
)

router.post('/deleteImage', function (req, res) {
    const filePath = req.body.path;
    fs.unlink(filePath, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to delete event image' });
        } else {
            const folderPath = path.dirname(filePath);
            deleteEmptyFolders(folderPath);
            res.status(200).json({ message: 'Event image deleted successfully' });
        }
    });
});

router.post('/uploadOrganizerImage', upload.array('files'), limiter, function (req, res, next) {

    const destinationOrganizerImage = req.body.organizerImagePath
    const organizerImage = req.files[0]

    fs.mkdirSync(destinationOrganizerImage, { recursive: true });


    //move icon from temp dir to destination
    fs.copyFile(
        organizerImage.path,
        path.join(destinationOrganizerImage, sanitizeFilename(organizerImage.filename)),
        function (err) {
            if (err) {
                res.status(500).json({ message: 'File Service Error: ', err });
                return console.error(err);
            } else {
                fs.rm(organizerImage.path,
                    function (err) {
                        if (err) {
                            res.status(500).json({ message: 'File Service Error: ', err });
                            return console.error(err);
                        }
                        organizerImage.path = path.join(destinationOrganizerImage, organizerImage.filename)
                        res.json({ 'organizerImage': organizerImage });
                    }
                )
            }
        }
    );
}
)

router.post('/downloadFile', limiter, function (req, res) {
    const dest = req.body.path
    res.download(dest)
})

async function deleteEmptyFolders(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        const files = await fs.promises.readdir(directoryPath);

        for (const file of files) {
            const currentPath = path.join(directoryPath, file);
            const stats = await fs.promises.stat(currentPath);

            if (stats.isDirectory()) {
                await deleteEmptyFolders(currentPath); // Recursively check and delete empty folders
            }
        }

        if ((await fs.promises.readdir(directoryPath)).length === 0) {
            await fs.promises.rmdir(directoryPath); // Delete the folder if it's empty
        }
    }
}


module.exports = router;
