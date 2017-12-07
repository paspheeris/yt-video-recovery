import {extractPlaylistsInfo} from '.././utils/yt';
import {
    GET_PLAYLISTS,
    GET_VIDEOS_FROM_PLAYLISTS,
    SUCCESS,
    FAILURE
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
        default:
            return state;
    }
}
export default playlists;
