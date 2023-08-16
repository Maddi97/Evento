var express = require('express');
var router = express.Router();
const Category = require("../model/category.model")
const auth = require("../middleware/authJWT");
const limiter = require("../middleware/rateLimiter")

router.get('/category', limiter, (req, res) => {
    Category.find({})
        .then(category => res.send(category))
        .catch(error => console.log(error))
});

router.post('/category', limiter, auth, (req, res) => {
    (new Category(req.body))
        .save()
        .then((category) => res.send(category))
        .catch((error) => console.log(error))
});

router.delete('/category/:categoryId', limiter, auth, (req, res) => {
    Category.findByIdAndDelete({ _id: req.params.categoryId })
        .then((category) => res.send(category))
        .catch((error) => console.log(error))
});

router.patch('/category/:categoryId', limiter, auth, (req, res) => {

    Category.findByIdAndUpdate({ _id: req.params.categoryId }, { $set: req.body.category }, { returnOriginal: false },
    )
        .then((category) => {
            res.send(category)
        })
        .catch((error => console.log(error)))
});

module.exports = router;
