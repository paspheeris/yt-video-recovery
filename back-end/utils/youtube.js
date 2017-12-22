const fetch = require('node-fetch');

const YT_API_ROOT = `https://www.googleapis.com/youtube/v3`;
function validateAccessToken(token) {
    return fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
        .then(data => data.json())
        .catch(error => console.log(error));
};
function parseValidationRes(validationRes) {
    // console.log('validationRes in parseValidationRes', validationRes);
    if(validationRes.error || validationRes.error_description) {
        return Promise.reject({
                error_description: 'Invalid or expired token',
                error_text: validationRes.error_description,
                error_location: 'parseValidationRes'
            });
    } else return ({
        email: validationRes.email,
        expiresAt: Date.now() + parseInt(validationRes.expires_in, 10)
    });
}
function getPlaylists(accessToken) {
    return fetch(`${YT_API_ROOT}/playlists?part=snippet&maxResults=50&mine=true&access_token=${accessToken}`)
        .then(data => data.json())
        .catch(error => console.log(error));
}
function parsePlaylistRes(playlistRes) {
    // console.log('playlistRes in parsePlaylistRes:', playlistRes);
    return playlistRes.items.map(playlist => {
        // console.log(playlist.snippet);
        return {
            title: playlist.snippet.title,
            id: playlist.id,
            thumbnail: playlist.snippet.thumbnails.medium,
            created: playlist.snippet.publishedAt
        };
    });
}
function getVideosFromPlaylist(accessToken, playlistId) {
  return fetch(`${YT_API_ROOT}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&access_token=${accessToken}`)
		.then(res => res.json())
		.catch(err => console.log(err));
}
function createVideosCount(playlistObjs) {
	// Given an array of playlistObjs, returns an objects whose keys are PL
	// IDs and whose values are the count of videos in that playlist
	return playlistObjs.reduce((accum, playlist) => {
		const length = playlist.videos ? playlist.videos.length : 0;
		accum[playlist.id] = length;
		return accum;
	}, {});
}
function extractVideosCount(apiRes) {
	// Given an apiRes, returns an object whose keys are PL
	// IDs and whose values are the count of videos in that playlist
	// Necesary because of the strange shape of the response from the API
	return apiRes.reduce((accum, playlist) => {
		const length = playlist.pageInfo.totalResults;
		const id = playlist.items[0].snippet.playlistId;
		accum[id] = length;
		return accum;
	}, {});

}

module.exports =  {
	validateAccessToken,
	parseValidationRes,
	getPlaylists,
	parsePlaylistRes,
	getVideosFromPlaylist,
	createVideosCount,
	extractVideosCount
};
