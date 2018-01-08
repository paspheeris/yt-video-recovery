import {extractPlaylistsInfo, getPlId,
				getDeletedVids, getRecoveredVids} from '.././utils/yt';
import {
    GET_PLAYLISTS,
    GET_VIDEOS_FROM_PLAYLISTS,
    SUCCESS,
	PL_METADATA,
	SINGLE_PLAYLIST,
  // FAILURE,
	DB_CACHED_USER,
	SIGN_OUT
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
			case DB_CACHED_USER:
				console.log('case DB_CACHED_USER', action);
				// return action.payload.playlists;
			const metadata = action.payload.playlistsMetadata.map( plMeta  => {
				// Find the corresponding list of videos
				const matchingPl = action.payload.playlists.find(pl => {
					return pl[0].snippet.playlistId === plMeta.id;
				});

				// No match found, just return what's already there, without counts
				if(!matchingPl) return plMeta;

				const deletedVids = getDeletedVids(matchingPl);
				const recoveredTitles = getRecoveredVids(deletedVids);
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
		case PL_METADATA:
			// console.log('PL_METADATA in reducer', action);
			// Not doing deleted/recovered count here for now, as they'll be set
			// as the individual PLs come in
			return {
				...state,
				metadata: action.payload
			};
		case SINGLE_PLAYLIST:
			console.log('SINGLE_PLAYLIST in reducer', action);
			const newPlaylist = action.payload;
			const newPlId = getPlId(newPlaylist);
			if (!state.videos || state.videos.length === 0) {
				// The first video to return needs to be handled differently
				return {
					videos: [ newPlaylist ],
					metadata: state.metadata.map(metadata => {
						if (metadata.id === newPlId) {
							return {
								...metadata,
								videoCount: newPlaylist.length,
								deletedCount: getDeletedVids(newPlaylist).length,
								recoveredCount: getRecoveredVids(newPlaylist).length
							};
						}
						else return metadata;
					})
				}
			}
			else return {
				videos: state.videos.map(pl => {
					// Replace the matching old PL with the new PL in payload,
					// otherwise just return the old PL
					const plId = getPlId(pl);
					if (plId === newPlId) return newPlaylist;
					else return pl;
				}),
				metadata: state.metadata.map(metadata => {
					if (metadata.id === newPlId) {
						return {
							...metadata,
							videoCount: newPlaylist.length,
							deletedCount: getDeletedVids(newPlaylist).length,
							recoveredCount: getRecoveredVids(newPlaylist).length
						};
					}
					else return metadata;
				})
			};
		case SIGN_OUT:
			return {};

		default:
			return state;
    }
}
export default playlists;
