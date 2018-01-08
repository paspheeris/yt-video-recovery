export function extractPlaylistsInfo(apiRes) {
    return apiRes.items.map(playlist => {
        return {
            title: playlist.snippet.title,
            id: playlist.id,
            thumbnail: playlist.snippet.thumbnails.medium,
            created: playlist.snippet.publishedAt
        };
    });
}
export function hasRecoveredTitle(videoObj) {
	// Returns a bool, indicating whether a video has a recovered title
	return videoObj.archive && videoObj.archive.available &&
		videoObj.archive.title !== 'staleSnapshot' &&
		videoObj.archive.title !== null;
}
export function getPlId(videos) {
	// returns the Pl Id that an array of videos belong to, based on the
	// first video
	return videos[0].snippet.playlistId;
}
export function getDeletedVids(pl) {
	return pl.filter(vid => vid.archive !== undefined);
}
export function getRecoveredVids(pl) {
	return pl.filter(vid => hasRecoveredTitle(vid));
}
export function mergePlsArr(plArr, newPl) {
	// Given an array of playlists, and a new playlist, will return the newPl
	// concated into the array, but if the pl already exists in the array, the
	// new pl will replace the old one, rather than being reduplicated
	if(!plArr || plArr.length === 0) return [].concat([ newPl ]);
	const matchingIndex = plArr.findIndex(oldPl => {
		const oldPlId = getPlId(oldPl);
		const newPlId = getPlId(newPl);
		if ( newPlId === oldPlId ) return true;
		else return false;
	});
	if (matchingIndex === -1) {
		// No match was found already in the plArr, so concat the newPl to the arr
		return plArr.concat([ newPl ]);
	} else {
		// A match was found, so replace it with the new pl
		return plArr.map((pl, i) => {
			if (i === matchingIndex) return newPl;
			else return pl;
		});
	}
}
