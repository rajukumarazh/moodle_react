const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  title: String,
  description: String,
  image_url: String,
  category: String,
  moodle_course_id: Number,
  price: Number,
});
const coursesTableSchema = mongoose.model("courses", courseSchema);

module.exports = coursesTableSchema;
