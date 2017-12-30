const fetch = require('node-fetch');

function checkAvailability(videoId) {
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
			console.log(error);
			return error;
		});
}

function extractTitle(snapshotUrl) {
	return fetch(snapshotUrl)
		.then(res => {
			if (res.status !== 200) {
				return Promise.reject({
					'error': 'Problem extracting title',
					'status': res.status,
					'statusText': res.statusText
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
			// console.log(title.trim());
			return title.trim();
			// return typeof htmlStr;
		})
		.catch(error => {
			console.log(error);
			// Returning here puts the error on the title field, shouldnt stay
			// like this
			// return error;
		});
}
module.exports = {
	checkAvailability,
	extractTitle
};
