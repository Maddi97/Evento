const mongoose = require('mongoose')

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
});


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    iconPath: {
        type: String,
    },
    subcategories: [SubcategorySchema]
});




const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;