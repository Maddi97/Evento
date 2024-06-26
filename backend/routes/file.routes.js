var crypto = require("crypto");
var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const limiter = require("../middleware/rateLimiter");
const sanitizeFilename = require("sanitize-filename"); // You can use the sanitize-filename package for additional validation

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `temp_dir`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      var err = new Error();
      err.code = "filetype";
      return cb(err);
    } else {
      cb(
        null,
        `${crypto.randomBytes(10).toString("hex")}_${Date.now()}_${
          file.originalname
        }`
      );
    }
  },
});

const upload = multer({ storage });

router.post(
  "/uploadCategoryImage",
  upload.array("files"),
  limiter,
  function (req, res, next) {
    const destinationCategoryImage = req.body.categoryImagePath;
    const categoryImage = req.files[0];
    console.log(destinationCategoryImage);
    console.log(categoryImage);
    fs.mkdirSync(destinationCategoryImage, { recursive: true });

    //move icon from temp dir to destination
    fs.copyFile(
      categoryImage.path,
      path.join(
        destinationCategoryImage,
        sanitizeFilename(categoryImage.filename)
      ),
      function (err) {
        if (err) {
          res.status(500).json({ message: "File Service Error: ", err });
          return console.error(err);
        } else {
          fs.rm(categoryImage.path, function (err) {
            if (err) {
              res.status(500).json({ message: "File Service Error: ", err });
              return console.error(err);
            }
            categoryImage.path = path.join(
              destinationCategoryImage,
              categoryImage.filename
            );
            res.json({ categoryImage: categoryImage });
          });
        }
      }
    );
  }
);

router.post(
  "/uploadEventImage",
  upload.array("files"),
  limiter,
  function (req, res, next) {
    const destinationEventImage = req.body.eventImagePath;
    const eventImage = req.files[0];

    fs.mkdirSync(destinationEventImage, { recursive: true });

    //move icon from temp dir to destination
    fs.copyFile(
      eventImage.path,
      path.join(destinationEventImage, sanitizeFilename(eventImage.filename)),
      function (err) {
        if (err) {
          res.status(500).json({ message: "File Service Error: ", err });
          return console.error(err);
        } else {
          fs.rm(eventImage.path, function (err) {
            if (err) {
              res.status(500).json({ message: "File Service Error: ", err });
              return console.error(err);
            }
            eventImage.path = path.join(
              String(destinationEventImage),
              eventImage.filename
            );
            res.json({ eventImage: eventImage });
          });
        }
      }
    );
  }
);

router.post("/deleteImage", function (req, res) {
  const filePath = req.body.path;
  fs.unlink(filePath, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete event image" });
    } else {
      const folderPath = path.dirname(filePath);
      deleteEmptyFolders(folderPath);
      res.status(200).json({ message: "Event image deleted successfully" });
    }
  });
});

router.post(
  "/uploadOrganizerImage",
  upload.array("files"),
  limiter,
  function (req, res, next) {
    const destinationOrganizerImage = req.body.organizerImagePath;
    const organizerImage = req.files[0];

    fs.mkdirSync(destinationOrganizerImage, { recursive: true });

    //move icon from temp dir to destination
    fs.copyFile(
      organizerImage.path,
      path.join(
        destinationOrganizerImage,
        sanitizeFilename(organizerImage.filename)
      ),
      function (err) {
        if (err) {
          res.status(500).json({ message: "File Service Error: ", err });
          return console.error(err);
        } else {
          fs.rm(organizerImage.path, function (err) {
            if (err) {
              res.status(500).json({ message: "File Service Error: ", err });
              return console.error(err);
            }
            organizerImage.path = path.join(
              destinationOrganizerImage,
              organizerImage.filename
            );
            res.json({ organizerImage: organizerImage });
          });
        }
      }
    );
  }
);

router.post("/downloadFile", limiter, function (req, res) {
  try {
    const filePath = req.body.path;
    // Validate file path
    if (!filePath) {
      return res.status(400).json({ error: "File path is required." });
    }

    // Send file for download
    res.download(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          return res.status(404).json({ error: "File not found." });
        } else {
          return res.status(500).json({ error: "Internal server error." });
        }
      }
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

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
