import {
    GET_VIDEOS_FROM_PLAYLISTS,
    SUCCESS,
    FAILURE
} from '.././actions/constants';

function videos(state ={}, action) {
    switch(action.type) {
    case(GET_VIDEOS_FROM_PLAYLISTS + SUCCESS):
        console.log(action);
    default:
    return state;
    }
}

export default videos;
