const express = require('express');
const cors = require('cors');
const fs = require('fs');
const handlebars = require('handlebars');
const Jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const smtpTransport = require('nodemailer-smtp-transport');
// require('dotenv').config({ path: __dirname + '/.env' });
require('./db/config');
const User = require('./db/User');
const Reset = require('./db/ResetRequest');
const Course = require('./db/Course');
const PaymentDetails = require('./db/PaymetDetails');
const stripe = require('stripe')(
	'sk_test_51LJuX6SHMCr56R0SJgdCL7BpIp07uBEidLxj92umLzYdIOJCQmDyN5nORCXqwGQQKUkVStMnqhKX1lKoCg46Mytk00oHUSWSRo'
);
console.log('hello');
const mailTemplate = handlebars.compile(
	fs.readFileSync('view/Temp.html', 'utf8')
);
const path = require('path');
const {
	moodleUserCreate,
	moodleEnrollApi,
	getUserCourses,
	getMoodleCat,
	getCourseByCategoryId,
	requestPasswordReset,
	resetPassword,
} = require('./Moodle/Api');

// const { MoodleClientConfig } = require('./Moodle/config');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use(cors());

const JwtKey = 'palinfocom370';

app.get('/home', async (req, resp) => {
	return resp.json({
		success: true,
		status: 'welcome',
	});
});

app.post('/register', async (req, resp) => {
	console.log('mdlResult', req.body);
	try {
		const mdlResult = await moodleUserCreate(req.body);

		const status = Array.isArray(mdlResult.body.data);
		if (status) {
			const { firstname, lastname, email, password, username } = req.body;

			let userdata = new User({
				firstname: firstname,
				lastname: lastname,
				email: email,
				password: password,
				username: username,
				moodle_user_id: mdlResult.body.data[0].id,
				roleid: 5,
			});
			let result = await userdata.save();
			result = result.toObject();
			delete result.password;
			const jwtToken = Jwt.sign({ result }, JwtKey, { expiresIn: '1h' });
			return resp.json({
				success: true,
				user: result,
				token: jwtToken,
			});
		} else {
			return resp.json({
				success: false,
				error: mdlResult.body.data.message,
			});
		}
	} catch (err) {
		console.log(err);
	}
});

// Login
app.post('/login', async (req, resp) => {
	console.log('req', req.body);
	try {
		let user = await User.findOne(req.body).select('-password');
		if (user) {
			console.log('user', user);
			Jwt.sign({ user }, JwtKey, { expiresIn: '1h' }, (err, token) => {
				if (err)
					return resp.json({ success: false, error: 'Someting will be wrong' });
				else return resp.json({ success: true, user: user, token: token });
			});
		} else {
			return resp.json({ success: false, error: 'No user found ' });
		}
	} catch (err) {
		return resp.json({ success: false, error: 'Something will be wrong' });
	}
});

// Create Course
app.post('/create-course', async (req, resp) => {
	let allCourse = await Course.findOne({
		moodle_course_id: req.body.moodle_course_id,
	});

	if (allCourse == undefined || null) {
		let coursedata = new Course(req.body);
		let result = await coursedata.save();
		return resp.json({ success: true, result: result });
	}

	// let coursedata = new Course(req.body);
	// let result = await coursedata.save();
	else {
		return resp.json({ success: false, error: 'Something will be wrong' });
	}
});

// Fetch Courses
app.get('/fetch-courses', async (req, resp) => {
	try {
		let coursedata = await Course.find();

		if (coursedata.length > 0) {
			return resp.json({ success: true, result: coursedata });
		} else {
			return resp.json({ success: false, error: 'No Course Found In DB' });
		}
	} catch (err) {
		return resp.json({ success: false, error: 'Something will be wrong' });
	}
});

//Razorpay create order
app.post('/payment-process', async (req, res) => {
	console.log('req.body', req.body);
	try {
		const instance = new Razorpay({
			key_id: process.env['RAZORPAY_KEY_ID'], // YOUR RAZORPAY KEY
			key_secret: process.env['RAZORPAY_SECRET_KEY'], // YOUR RAZORPAY SECRET
		});

		const { amount, currency, user } = req.body;

		const options = {
			amount: amount * 100,
			currency: currency,
			receipt: shortid.generate(),
			payment_capture: 1,
			notes: {
				user_id: user._id,
			},
		};

		const order = await instance.orders.create(options);

		if (!order) return res.status(500).send('Some error occured');

		res.json(order);
	} catch (error) {
		res.status(500).send(error);
	}
});

//Verify Razorpay Order
// app.post('/verify-order', async (req, res) => {
// 	try {
// 		const {
// 			razorpay_order_id,
// 			razorpay_payment_id,
// 			razorpay_signature,
// 			moodle_course_ids,
// 			user,
// 		} = req.body;

// 		// Pass yours key_secret here
// 		const key_secret = process.env.RAZORPAY_SECRET_KEY;

// 		// Creating hmac object
// 		let hmac = crypto.createHmac('sha256', key_secret);

// 		// Passing the data to be hashed
// 		hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

// 		// Creating the hmac in the required format
// 		const generated_signature = hmac.digest('hex');

// 		if (razorpay_signature === generated_signature) {
// 			moodle_course_ids?.map(async (e) => {
// 				const moodleEnroll = await moodleEnrollApi(user?.moodle_user_id, e);
// 				console.log('moodleEnroll', moodleEnroll);
// 			});

// 			res.json({ success: true, message: 'Payment has been verified' });
// 		} else res.json({ success: false, message: 'Payment verification failed' });
// 	} catch (error) {
// 		res.status(500).send(error);
// 	}
// });

// Get User Enroll Courses

app.post('/enrolled-courses', async (req, res) => {
	try {
		const { moodle_user_id } = req.body;

		const userCourses = await getUserCourses(moodle_user_id);

		res.json({ success: true, result: userCourses.body.data });
	} catch (error) {
		res.status(500).send(error);
	}
});
app.post('/payment_details', async (req, res) => {
	console.log('helloQi', req.body);
	var date = new Date(req.body.date * 1000);
	let time = date.toUTCString();
	try {
		const data = new PaymentDetails({
			user_id: req.body.user_id,
			course: req.body.course,
			order_id: req.body.order_id,
			date: req.body.date,
			amount: req.body.amount,
		});
		const dataToSave = await data.save();

		res.json({ success: true, result: dataToSave });
	} catch (error) {
		res.status(500).send(error);
	}
});
/// get Reports of purchase
app.post('/reports', async (req, res) => {
	let dt = await PaymentDetails.find();
	function calDate(eph) {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var date = new Date(eph * 1000);
		console.log('ddddddddd', date.toUTCString());
		return date.toUTCString();
	}
	let dt2 = dt.map((curr) => {
		return {
			_id: curr._id,
			user_id: curr.user_id,
			order_id: curr.order_id,
			course: curr.course,
			amount: curr.amount,
			date: calDate(curr.date),
		};
	});

	//  console.log(calDate());
	// console.log(dt2);
	res.send(
		dt.map((curr) => {
			return {
				_id: curr._id,
				user_id: curr.user_id,
				order_id: curr.order_id,
				course: curr.course,
				amount: curr.amount,
				date: calDate(curr.date),
			};
		})
	);
});
app.get('/categories', async (req, res) => {
	let dt = await getMoodleCat();
	console.log('dt', dt.body.data);
	res.json(dt.body.data);
});

app.post('/category_course', async (req, res) => {
	try {
		const { moodle_user_id } = req.body;

		const userCourses = await getCourseByCategoryId(req.body.value);

		//res.json({ success: true, result: categorycourses.body.data });
		// return res.json(userCourses?.body?.data);
		if (userCourses) {
			res.json(userCourses);
		}
		console.log('ccccc', userCourses);
	} catch (error) {
		res.status(500).send(error);
	}
});
app.post('/update-course', async (req, res) => {
	console.log('req.body', req.body);
	let { category, moodle_course_id, title, description, price } = req.body;

	// res.json(req.body.moodle_user_id);
	try {
		const result = await Course.updateOne(
			{ moodle_course_id: moodle_course_id },
			{
				$set: {
					title: title,
					category: category,
					description: description,
					price: price,
				},
			}
		);

		if (result) {
			res.json(result);
		}
		// console.log('updatedCourse', result);
	} catch (error) {
		res.status(500).send(error);
	}
});
/// Stripe payment api
app.post('/stripe-payment', async (req, res) => {
	const { price } = req.body;
	console.log('req.body.stripe', req.body);

	// console.log('req.body.stripe', price / 100);
	const paymentIntent = await stripe.paymentIntents.create({
		// hidePostalCode: true,
		amount: price, // subunits of currency
		currency: 'usd',
		description: 'for amazon-clone project',
		shipping: {
			name: 'Random',
			address: {
				line1: '510 Townsend St',
				postal_code: '98140',
				city: 'San Francisco',
				state: 'CA',
				country: 'US',
			},
		},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

///notification Email

app.post('/send-email', (req, res) => {
	console.log('sendmail', req.body);
	let { Quantity, Item, orderNumber, Total, email, name } = req.body;
	const transporter = nodemailer.createTransport({
		host: 'smtp.dreamhost.com',
		port: 465,
		secure: true,
		logger: true,
		debug: true,
		auth: {
			user: 'raju.kumar@palinfocom.com',
			pass: 'pjzS3j4m',
		},
	});

	const mailOptions = {
		from: 'raju.kumar@palinfocom.com',
		to: 'jaspreet.dev@palinfocom.com',
		subject: 'Purchase Confirmation!',
		html: mailTemplate({
			name: name, // replace {{name}} with Adebola
			// company: 'My Company', // replace {{company}} with My Company
			orderNumber: orderNumber,
			Item: Item,
			Quantity: Quantity,
			Total: Total,
		}),
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
	// const mailOptions = {
	// 	from: 'raju.kumar@palinfocom.com',
	// 	to: 'jaspreet.dev@palinfocom.com',
	// 	to: req.body.email,
	// 	subject: 'Purchase Confirmation',
	// 	text: req.body.message,
	// };

	// transporter.sendMail(mailOptions, (error, info) => {
	// 	if (error) {
	// 		console.log('error');
	// 	} else {
	// 		console.log('sent');
	// 		// console.log('Email sent: ' + info.response);
	// 	}
	// });
});
///enrolling user on course
app.post('/enroll_user', async (req, res) => {
	let { moodle_course_ids, user } = req.body;

	moodle_course_ids &&
		moodle_course_ids.map(async (e) => {
			const moodleEnroll = await moodleEnrollApi(user, e);
			console.log('moodleEnroll', moodleEnroll);
		});
	console.log('ehl', req.body);
});
//// forgot password
app.post('/forgot_password', async (req, res) => {
	// console.log('kddddd', req.body);
	let { email, password, conf_password } = req.body.user;

	let checkingEmail = User.find({ email: email }, (err, users) => {
		if (err) {
			console.error(err);
			// Handle the error appropriately
		} else {
			console.log(users);
			// Process the retrieved users
		}
	});
	console.log('userrdata', checkingEmail);
	User.updateOne(
		{ email: email },
		{ $set: { password: conf_password } }, // Update
		{ upsert: true },
		(err, users) => {
			if (err) {
				res.status(500).json({
					success: false,
					message: 'error while updating password',
					error: err,
				});
			} else {
				res.status(200).json({
					success: true,
					message: 'password updated successfully',
					data: users,
				});
			}
		}
	);

	// let dts = await requestPasswordReset({ email: email, username: username });
	// console.log('dts', dts);
	// res.send(dts);
});
/// sending password reset mail
app.post('/reset-mail', async (req, res) => {
	let checkingEmail = User.find({ email: req.body.email }, (err, users) => {
		if (err) {
			console.error(err);
			// Handle the error appropriately
		} else {
			let r = (Math.random() + 1).toString(36).substring(7);

			// console.log('users', users);
			// Process the retrieved users
			let resetData = new Reset({
				moodle_user_id: users[0].moodle_user_id,
				email: users[0].email,
				token: r,
			});
			let datas = resetData.save();
			console.log('datas', datas);
			const transporter = nodemailer.createTransport({
				host: 'smtp.dreamhost.com',
				port: 465,
				secure: true,
				logger: true,
				debug: true,
				auth: {
					user: 'raju.kumar@palinfocom.com',
					pass: 'pjzS3j4m',
				},
			});
			let sms = req.body.message.replace(/happy learning/g, '?') + r;
			let sms2 = sms.replace(/\s/g, '');
			console.log('sms2', sms);

			const regex = /http:\/\/34.67.169.193\/resetpassword/;
			const extractedString = req.body.message.match(regex)[0]; // Extract the string

			const modifiedString = req.body.message.replace(
				extractedString,
				extractedString + '?' + r
			); // Add "/newpath" to the extracted string and replace it in the original string

			console.log('modifiedString', modifiedString);
			const mailOptions = {
				from: 'raju.kumar@palinfocom.com',
				// to: 'raju.kumar@palinfocom.com',
				to: users[0].email,
				subject: 'Password Reset',
				text: modifiedString,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log('error');
				} else {
					res.status(200).json({
						success: true,
						message: 'mail sent successfully',
						data: users,
					});
					// console.log('Email sent: ' + info.response);
				}
			});
		}
	});
	console.log('hello react', req.body.email);
});
app.post('/matchrequest', async (req, res) => {
	console.log('red', req.body.token);
	// let checkingEmail = Reset.find({ token: req.body.token }, (err, datas) => {
	// 	if (err) {
	// 		console.error(err);
	// 		// Handle the error appropriately
	// 	} else {
	// 		console.log('datas', datas);
	// 		// Process the retrieved users
	// 	}
	// });
	let tokens = await Reset.find();
	let current = tokens.filter((curr) => curr.token == req.body.token);
	console.log('kkkk', req.body);
	if (current[0]) {
		let checkingEmail = User.find({ email: current[0].email }, (err, users) => {
			if (err) {
				console.error(err);
			} else {
				console.log(users);
			}
		});
		console.log('userrdata', checkingEmail);
		User.updateOne(
			{ email: current[0].email },
			{ $set: { password: req.body.user.conf_password } }, // Update
			{ upsert: true },
			(err, users) => {
				if (err) {
					res.status(500).json({
						success: false,
						message: 'error while updating password',
						error: err,
					});
				} else {
					console.log('suererd', users);
					res.status(200).json({
						success: true,
						message: 'password updated successfully',
						data: users,
					});
				}
			}
		);
	}
});
app.post('/remove_reset_token', async (req, res) => {
	let { token } = req.body;

	Reset.findOneAndRemove({ token: token }, (err, resettokens) => {
		if (err) {
			console.log('ereor', err);
			res.status(500).json({
				success: false,
				message: 'error while deleting current token',
				error: err,
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'password updated successfully',
				data: resettokens,
			});
		}
	});
});
app.post('/reset_to_moodle', async (req, res) => {
	//console.log('req', typeof +req.body.newPassword);
	let moodleReset = await resetPassword({
		userId: +req.body.userId,
		newPassword: req.body.newPassword,
	});
	res.send({ source: moodleReset });
	// console.log('password', moodleReset);
});
app.listen(5000);
