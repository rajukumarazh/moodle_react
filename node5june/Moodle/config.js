// const { MoodleClient } = require("node-moodle");

const config = {
	MOODLE_BASE_URL: 'http://34.30.203.130/md39/',
	MOODLE_API_URL: 'http://34.30.203.130/md39/webservice/rest/server.php',
	MOODLE_API_AUTH_TOKEN: '37f9daee0302ee083f034afa10c6300c',
};

// const MoodleClientConfig = new MoodleClient({
//   baseUrl: "http://34.136.58.187/md39", //<-- Put your Moodle URL here
//   token: "37f9daee0302ee083f034afa10c6300c", //<-- Put your token here
// });

module.exports = {
	config,
};
