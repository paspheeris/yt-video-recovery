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

module.exports =  {
	validateAccessToken,
	parseValidationRes,
	getPlaylists,
	parsePlaylistRes
};
