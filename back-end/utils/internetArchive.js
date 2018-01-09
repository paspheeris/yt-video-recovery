const fetch = require('node-fetch');
const he = require('he');

function checkAvailability(videoId) {
	console.log('performing availablity check');
	console.log(videoId);
	const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
	const endpoint = `http://web.archive.org/cdx/search/cdx?url=${videoUrl}&output=json`

	// The form of the JSON response is odd, check this link for an example
	// http://web.archive.org/cdx/search/cdx?url=https://www.youtube.com/watch?v=zQ05vleQZOQ&output=json

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
			if (json.length === 0) {
				// When a page isn't archived, the cdx API returns an empty arr;
				return {
					'available': false,
					videoId
				};
			}
			const timestamp = json[1][1];
			const url = `http://web.archive.org/web/${timestamp}/${videoUrl}`;
			return {
				url,
				timestamp,
				'available': true,
				videoId
			};
		})
		.catch(error => {
			// console.log(error);
			// The Internet Archive appears to do rate limiting that's not documented
			// anywhere. Here we just redo the request if we get the 'ECONNREFUSED'
			// error. Should probably add in a maximum number of retries to make, so
			// that we don't get caught in infinite recursion here.
			if(error.errno === 'ECONNREFUSED') {
				return checkAvailability(videoId);
			}
		});
}

function extractTitle(snapshotUrl) {
	console.log('performing title extraction');
	console.log(snapshotUrl);
	return fetch(snapshotUrl)
		.then(res => {
			if (res.status !== 200) {
				return Promise.reject({
					'error': 'Problem extracting title',
					'status': res.status,
					'statusText': res.statusText,
					snapshotUrl
				});
			}
			return res.text();
		})
		.then(htmlStr => {
			const titleStart = htmlStr.indexOf('<title>');
			const titleEnd = htmlStr.indexOf('</title>', titleStart);
			const title = htmlStr.slice(titleStart + 7, titleEnd);
			// console.log(titleStart,titleEnd);
			if (titleStart === -1 || titleEnd === -1) {
				console.log('Error: error parsing the html res in extractTitle');
			}
			const trimmedTitle = title.trim();
			// Convert html encodings to their normal string form, eg takes
			// &#39 and converts to a normal apostrophe
			const htmlDecoded = he.decode(trimmedTitle);
			// Remove duplicate contiguous spaces
			const spacesRemoved = htmlDecoded.replace(/\s+/g, " ");
			// Sometimes 'YouTube -' or '- YouTube', is at the start or end of the
			// title, so remove it
			const initial = spacesRemoved.replace('YouTube -', '');
			const final = initial.replace('- YouTube', '');

			// It's possible that even the earliest archive of a YT page is a
			// snapshot of the page after the video had been deleted. In that case,
			// all that's between the <title> tags is 'YouTube', so we need to
			// return some error rather than the scraped title, to be dealth with
			// at the site calling this function
			if(trimmedTitle === 'YouTube') return 'staleSnapshot';
			else return final;
		})
		.catch(error => {
			// console.log(error);
			if(error.errno === 'ECONNREFUSED') {
				return extractTitle(snapshotUrl);
			}

		});
}
module.exports = {
	checkAvailability,
	extractTitle
};
