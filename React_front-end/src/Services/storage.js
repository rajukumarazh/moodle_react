export const saveToLocal = (key, data) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocal = (key) => {
	const data = localStorage.getItem(key);
	return JSON.parse(data);
};

export const removeFromLocal = (key) => {
	localStorage.removeItem(key);
};

export const NODE_API_URL = 'http://34.67.169.193:5000';
//export const NODE_API_URL = 'http://localhost:5000';
export const RAZORPAY_KEY_ID = 'rzp_test_5oIzS2nV8uytoj';

export const MOODLE_URL = 'http://34.30.203.130/md39/';
