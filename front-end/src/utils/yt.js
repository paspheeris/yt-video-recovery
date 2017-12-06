export function extractPlaylistsInfo(apiRes) {
    return apiRes.items.map(playlist => {
        return {
            title: playlist.snippet.title,
            thumbnail: playlist.snippet.thumbnails.medium,
            created: playlist.snippet.publishedAt
        };
    });
}
