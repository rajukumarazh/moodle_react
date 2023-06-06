const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  username: String,
  moodle_user_id: Number,
  roleid: Number,
});
const userTableSchema = mongoose.model("users", userSchema);

module.exports = userTableSchema;
