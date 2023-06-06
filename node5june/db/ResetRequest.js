const mongoose = require('mongoose');

const resetpasswordSchema = mongoose.Schema({
	// title: String,
	// description: String,
	// image_url: String,
	// category: String,
	// moodle_course_id: Number,
	// price: Number,
	moodle_user_id: Number,
	user_id: String,
	email: String,
	token: String,
});
const ResetRequest = mongoose.model('reseetrequest', resetpasswordSchema);

module.exports = ResetRequest;
