const fetch = require('node-fetch');

function checkAvailability(videoId) {
	// Returns an "archived_snapshot" that tells whether a page has been saved
	// on the video archive. Since the newest archive of a video might be from
	// after it had been deleted, we also provide a timestamp long before the
	// video date, so that the nearest snapshot that it returns is the first
	// snapshot that was taken of a video.
	const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
	const endpoint = `http://archive.org/wayback/available?url=${videoUrl}&timestamp=20060101`;
	return fetch(endpoint)
		.then(res => {
			return res.json();
			// console.log(res);
		})
		.catch(error => console.log(error));
}
module.exports = {
	checkAvailability
};
