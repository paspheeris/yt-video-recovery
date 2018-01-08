import {extractPlaylistsInfo} from '.././utils/yt';
import {
    GET_PLAYLISTS,
    GET_VIDEOS_FROM_PLAYLISTS,
    SUCCESS,
  // FAILURE,
	UPDATE_PLAYLISTS
} from '.././actions/constants';

function playlists(state = {}, action) {
    switch (action.type) {
        case (GET_PLAYLISTS + SUCCESS):
        // console.log(extractPlaylistsInfo(action.payload));
        const summaries = extractPlaylistsInfo(action.payload);
        return {
            ...state,
            summaries,
            allTitles: summaries.map(summary => summary.title)
        };
    case (GET_VIDEOS_FROM_PLAYLISTS + SUCCESS):
        // Add the total number of videos to the summary for the playlist
        const id = action.meta.playlistId;
        return {
            ...state,
            summaries: state.summaries.map(summary => {
                if(summary.id === id) {
                    return {
                        ...summary,
                        totalVideos: action.payload.pageInfo.totalResults
                    };
                } else return summary;
            })
        };
			case UPDATE_PLAYLISTS:
				console.log('case UPDATE_PLAYLISTS', action);
				// return action.payload.playlists;
			const metadata = action.payload.playlistsMetadata.map( plMeta  => {
				// Find the corresponding list of videos
				const matchingPl = action.payload.playlists.find(pl => {
					// console.log('PL: ', pl);
					// console.log('plMeta: ', plMeta);
					return pl[0].snippet.playlistId === plMeta.id;
				});

				// No match found, just return what's already there, without counts
				if(!matchingPl) return plMeta;

				const deletedVids = matchingPl.filter(vid => {
					return vid.archive !== undefined;
				});
				const recoveredTitles = deletedVids.filter(vid => {
					return (vid.archive && vid.archive.available
									&& vid.archive.title !== 'staleSnapshot');
				});
				return {
					...plMeta,
					videoCount: matchingPl.length,
					deletedCount: deletedVids.length,
					recoveredCount: recoveredTitles.length
				};
			});
			return {
				videos: action.payload.playlists,
				metadata
			};
			default:
					return state;
    }
}
export default playlists;
