import {extractPlaylistsInfo} from '.././utils/yt';
import {
    GET_PLAYLISTS,
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
        default:
            return state;
    }
}
export default playlists;
