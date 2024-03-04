const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  alias: {
    type: [String],
  },
  weight: {
    type: String,
  },
  iconPath: {
    type: String,
  },
  stockImagePath: {
    type: String,
  },
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  alias: {
    type: [String],
  },
  weight: {
    type: String,
  },
  iconPath: {
    type: String,
  },
  stockImagePath: {
    type: String,
  },
  subcategories: [SubcategorySchema],
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
