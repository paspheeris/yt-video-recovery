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
