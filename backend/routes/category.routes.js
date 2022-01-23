var express = require('express');
var router = express.Router();
const Category = require("../model/category.model")

router.get('/category', (req, res) => {
    Category.find({})
    .then(category => res.send(category))
    .catch(error => console.log(error))
});
  
router.post('/category', (req, res) => {
    (new Category(req.body)) 
    .save()
    .then((category) => res.send(category))
    .catch((error) => console.log(error))
});

router.delete('/category/:categoryId', (req, res) =>{
    Category.findByIdAndDelete({_id: req.params.categoryId})
    .then((category) => res.send(category))
    .catch((error) => console.log(error))
});

router.patch('/category/:categoryId', (req, res) => {

    Category.findByIdAndUpdate({ _id: req.params.categoryId } , { $set: req.body.category },{ returnOriginal: false },
    )
    .then((category) => {
        res.send(category)
    })
    .catch((error => console.log(error)))
});

module.exports = router;