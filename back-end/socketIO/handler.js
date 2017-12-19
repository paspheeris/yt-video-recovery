const fetch = require('node-fetch');
const { validateAccessToken,
			  parseValidationRes,
			  getPlaylists,
			  parsePlaylistRes } = require('../utils/youtube');
const { saveTest,
			  saveUser,
				savePlaylists} = require('../utils/mongodb.js');

function socketHandler(client) {
	console.log('connect in the wwww');
	client.on('test', (d) => {
		console.log(d);
		client.emit('testDataReceived', d);
	});
	client.on('accessToken', token => {
		let userEmail;
		// Validate token, then...
		validateAccessToken(token)
		// ...parse res into a form to use
			.then(validationRes => parseValidationRes(validationRes))
		// ...save the user in DB if they're not already there
			.then(userObj => {
				// Save userEmail in the local scope so that it can be used through
				// the rest of the promise chain
				userEmail = userObj.email;
				return saveUser(userObj);
			})
			.then(userData => {
				// Send saved user data to the frontend, if found
				// ie. send playlist titles and playlists that are already saved
				if(userData !== null) {
					// console.log('userData in promise chain:', userData);
				}
			})
		// ...get playlist data for the user
			.then(_ => getPlaylists(token))
			.then(playlistRes => parsePlaylistRes(playlistRes))
			.then(playlistObjs => {
				// Save any new playlists in the DB under the user
				return savePlaylists(userEmail, playlistObjs);
			})
			.then(updatedUser => {
				console.log(updatedUser);
			})
			.catch(error => console.log(error));
	});
}



module.exports = {
	socketHandler
};
