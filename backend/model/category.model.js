const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    icon:{
        type: String,
    },
    subcategories: [String]
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;