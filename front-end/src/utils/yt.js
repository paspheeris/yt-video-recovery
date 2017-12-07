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
