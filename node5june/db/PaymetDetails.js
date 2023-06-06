const mongoose = require('mongoose');

const PaymentDetailsSchema = mongoose.Schema({
	// title: String,
	// description: String,
	// image_url: String,
	// category: String,
	// moodle_course_id: Number,
	// price: Number,
	user_id: String,
	order_id: String,
	course: Array,
	amount: Number,
	// course_name: String,
	date: Number,
});
const paymentTableSchema = mongoose.model('payments', PaymentDetailsSchema);

module.exports = paymentTableSchema;
