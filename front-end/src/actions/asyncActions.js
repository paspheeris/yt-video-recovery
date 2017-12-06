import store from '.././store';
import {
    GET_PLAYLISTS
} from './constants';

// const API_ROOT = 'https://secure-hollows-42406.herokuapp.com/api';
const YT_API_ROOT = `https://www.googleapis.com/youtube/v3`;


// const requests = {
//     get: url =>
//         fetch(`${url}`)
// };

export const YT = {
    getPlaylists: () => ({
        type: GET_PLAYLISTS,
        payload: fetch(`${YT_API_ROOT}/playlists?part=snippet&maxResults=50&mine=true&access_token=${store.getState().auth.access_token}`)
    })
};

