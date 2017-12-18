const fetch = require('node-fetch');
const { validateAccessToken,
			  parseValidationRes,
			  getPlaylists,
			  parsePlaylistRes } = require('../utils/youtube');

function socketHandler(client) {
  console.log('connect in the wwww');
  client.on('test', (d) => {
    console.log(d);
    client.emit('testDataReceived', d);
  });
  client.on('accessToken', token => {
    // Validate token, then...
    validateAccessToken(token)
    // ...parse res into a form to use
      .then(validationRes => parseValidationRes(validationRes))
    // .then(userInfo => console.log(userInfo))
    // ...check the db for user info here and send if found
			.then(userObj => console.log(userObj))
    // ...get playlist data for the user
      .then(_ => getPlaylists(token))
      .then(playlistRes => parsePlaylistRes(playlistRes))
      .then(playlistObjs => console.log(playlistObjs))
      .catch(error => console.log(error));
  });
}



module.exports = {
	socketHandler
};
