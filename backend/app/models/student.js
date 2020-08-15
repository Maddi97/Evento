var mongoose = require("mongoose");

// define our students model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model("Student", {
  name: { type: String, default: "" },
});
