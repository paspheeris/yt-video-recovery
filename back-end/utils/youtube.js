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
	if(!playlistRes.items) {
		// User doesn't have any playlists; return an empty array and show errors
		return [];
	}
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
	// Fetches the first 50 videos in a given playlist
  return fetch(`${YT_API_ROOT}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&access_token=${accessToken}`)
		.then(res => res.json())
		.catch(err => console.log(err));
}
function getVideosWithPageToken(accessToken, playlistId, nextPageToken) {
	// Fetches the next 50 videos in a playlist, given a page token
  return fetch(`${YT_API_ROOT}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&access_token=${accessToken}&pageToken=${nextPageToken}`)
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
function fetchAllVideos(accessToken, playlistId, nextPageToken, accum) {
	// Since the YT API can only return info on 50 videos at a time, and the
	// next 50 must be fetched with a token that comes in each request, a
	// synchronous series of calls must be made to the API in order to get
	// all videos in a playlist

	// Base Case
	if (nextPageToken === undefined && accum.length !== 0) return accum;
	// Recurse Case
	else if (nextPageToken === undefined && accum.length === 0) {
		// Getting the first 50 of a PL, so there's no nextPageToken yet
		return getVideosFromPlaylist(accessToken, playlistId)
			.then(first50 => {
				return fetchAllVideos(
					accessToken, playlistId, first50.nextPageToken,
					accum.concat(first50.items)
				);
			});
	}
	else return getVideosWithPageToken(accessToken, playlistId, nextPageToken)
		.then(next50 => {
			// if (next50.items.length === 0) {
				// Make sure there's something in the playlist?
				// return accum;
			// }
			// console.log('next50 in fetchAllVideos', next50);
			return fetchAllVideos(
				accessToken, playlistId, next50.nextPageToken,
				accum.concat(next50.items)
			);
		})
	  .catch(error => console.log(error));
}
function extractDeletedVideos(playlist) {
	// Given a playlist of videos, returns the videos that have been deleted
	return playlist.filter(video => {
		return video.snippet.description === "This video is unavailable."
					 || video.snippet.title === "Deleted video";
	});
}
function vidIsDeleted(videoObj) {
	return videoObj.snippet.description === "This video is unavailable."
	|| videoObj.snippet.title === "Deleted video";
}
module.exports =  {
	validateAccessToken,
	parseValidationRes,
	getPlaylists,
	parsePlaylistRes,
	getVideosFromPlaylist,
	createVideosCount,
	extractVideosCount,
	fetchAllVideos,
	extractDeletedVideos,
	vidIsDeleted
};
