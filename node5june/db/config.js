const express = require('express');
const mongoose = require('mongoose');
// mongoose
// 	.connect(
// 		// 'mongodb+srv://raju:Ra%409058837496@cluster0.uwtgdvq.mongodb.net/cluster0?retryWrites=true&w=majority'
// 		'mongodb+srv://raju:Ra%409058837496@cluster0.kjkyk5j.mongodb.net/cluster0?retryWrites=true&w=majority'
// 	)
// 	.then(() => {
// 		console.log('database connnected');
// 	});
mongoose.connect('mongodb://127.0.0.1:27017/moodle');
