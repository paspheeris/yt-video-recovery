const fetch = require('node-fetch');

function checkAvailability(videoId) {
	// Returns an "archived_snapshot" that tells whether a page has been saved
	// on the video archive. Since the newest archive of a video might be from
	// after it had been deleted, we also provide a timestamp long before the
	// video date, so that the nearest snapshot that it returns is the first
	// snapshot that was taken of a video.
	// console.log(videoId);
	const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
	const endpoint = `http://archive.org/wayback/available?url=${videoUrl}&timestamp=20060101`;
	// console.log(endpoint);
	return fetch(endpoint)
		.then(res => {
			if (res.status !== 200) {
				return Promise.reject({
					'error': 'Problem checking availibility of resource',
					'status': res.status,
					'statusText': res.statusText
				});
			}
			else return res.json();
		})
		.then(json => {
			console.log(json);
			if(!json.archived_snapshots.closest) {
				return {'available': false, videoId};
			}
			const { available, url, timestamp } =
						json.archived_snapshots.closest;

			// Maybe include the videoId here for convenience later?
			return ({
				available, // true or false
				url,
				timestamp,
				videoId
			});
		})
		.catch(error => {
			console.log(error);
			return error;
		});
}
function extractTitle(snapshotUrl) {
	return fetch(snapshotUrl)
		.then(something => {
			return something.text();
		})
		.then(htmlStr => {
			const titleStart = htmlStr.indexOf('<title>');
			const titleEnd = htmlStr.indexOf('</title>', titleStart);
			const title = htmlStr.slice(titleStart + 7, titleEnd);
			// console.log(titleStart,titleEnd);
			if (titleStart === -1 || titleEnd === -1) {
				console.log('Error: error parsing the html res in extractTitle');
			}
			return title.trim();
			// return typeof htmlStr;
		})
		.catch(error => console.log(error));
}
module.exports = {
	checkAvailability,
	extractTitle
};
