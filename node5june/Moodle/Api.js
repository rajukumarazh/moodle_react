const MoodleClient = require('moodle-client');

const { default: axios } = require('axios');

const { config } = require('./config');
const request = require('request');

// Moodel user create api
const moodleUserCreate = async (userdata) => {
	const { firstname, lastname, email, password, username } = userdata;
	const postUrl =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=core_user_create_users&moodlewsrestformat=json&users[0][firstname]=' +
		firstname +
		'&users[0][lastname]=' +
		lastname +
		'&users[0][email]=' +
		email +
		'&users[0][password]=' +
		password +
		'&users[0][username]=' +
		username;

	try {
		const res = await axios.post(postUrl, {});

		return {
			statusCode: 200,
			body: res,
		};
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify(e),
		};
	}
};

// Moodel Course Enroll api
const moodleEnrollApi = async (user_id, course_id) => {
	let url =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=enrol_manual_enrol_users&moodlewsrestformat=json&enrolments[0][roleid]=5&enrolments[0][userid]=' +
		user_id +
		'&enrolments[0][courseid]=' +
		course_id;

	try {
		const res = await axios.post(url, {});
		console.log(res);
		return {
			statusCode: 200,
			body: res,
		};
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify(e),
		};
	}
};

// Get user courses
const getUserCourses = async (user_id) => {
	let url =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid=' +
		user_id;

	try {
		const res = await axios.post(url, {});
		console.log(res);
		return {
			statusCode: 200,
			body: res,
		};
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify(e),
		};
	}
};

const wsVersion = 'wstoken=' + config.MOODLE_API_AUTH_TOKEN + '&wsfunction=';

// Function to get categories

// Example usage
const getMoodleCat = async () => {
	let url =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=core_course_get_categories&moodlewsrestformat=json';

	try {
		const res = await axios.post(url, {});
		// console.log(res);
		return {
			statusCode: 200,
			body: res,
		};
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify(e),
		};
	}
};

const getCourseByCategoryId = async (categoryId) => {
	console.log('cateId', categoryId);
	let url =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=core_course_get_courses_by_field&moodlewsrestformat=json';

	try {
		const res = await axios.post(url, {
			args: {
				field: 'category',
				value: categoryId,
			},
		});
		// console.log(res.data);
		return res.data;
		// return {
		// 	statusCode: 200,
		// 	body: res,
		// };
	} catch (e) {
		console.log(e);
		return {
			statusCode: 400,
			body: JSON.stringify(e),
		};
	}
};

const requestPasswordReset = async ({ email, username }) => {
	console.log('email', email, 'username', username);
	let url =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=core_auth_request_password_reset&moodlewsrestformat=json';
	let dt = await axios
		.post(url, { username: username, email: email })
		.then((res) => res);

	return dt.data;
	// try {
	// 	const requestData = {};

	// 	if (username) {
	// 		requestData.username = username;
	// 	}

	// 	if (email) {
	// 		requestData.email = email;
	// 	}

	// 	if (!requestData.username && !requestData.email) {
	// 		console.error('Please provide either username or email address.');
	// 		return;
	// 	}

	// 	const response = await axios.post(url, requestData);
	// 	const data = response.data;
	// 	console.log('response', data);
	// 	return {
	// 		statusCode: 200,
	// 		body: response,
	// 	};
	// } catch (error) {
	// 	return {
	// 		statusCode: 500,
	// 		body: error,
	// 	};
	// }
};
async function resetPassword(userId, newPassword) {
	const postUrl =
		config.MOODLE_API_URL +
		'?wstoken=' +
		config.MOODLE_API_AUTH_TOKEN +
		'&wsfunction=core_user_update_users&moodlewsrestformat=json&users[0][id]=' +
		userId +
		'&users[0][password]=' +
		newPassword;
	try {
		const res = await axios.post(postUrl, {});

		const data = res.data;

		// Check the response for errors
		if (data.exception) {
			throw new Error(data.message);
		}

		return {
			statusCode: 200,
			body: res,
		};
	} catch (error) {
		console.error('Error resetting password:', error.message);
	}
}

module.exports = {
	moodleUserCreate,
	moodleEnrollApi,
	getUserCourses,
	getMoodleCat,
	getCourseByCategoryId,
	requestPasswordReset,
	resetPassword,
};
