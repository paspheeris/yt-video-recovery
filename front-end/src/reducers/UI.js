import {getPlId} from '../utils/yt.js';
import {
	DB_CACHED_USER,
	PL_METADATA,
	SINGLE_PLAYLIST,
	INIT_GET_DB_CACHE,
	NO_FOUND_PLAYLISTS
    // SUCCESS,
    // FAILURE
} from '.././actions/constants';

function UI(state ={}, action) {
    switch(action.type) {
    case PL_METADATA:
			// PL Metadata has come in, so show 'updating...' spinners
			const plIds = action.payload.map(pl => pl.id);
			return {
				...state,
				playlistSpinners: plIds
			};
		case SINGLE_PLAYLIST:
			return {
				...state,
				playlistSpinners: state.playlistSpinners.filter(id => {
					return id !== getPlId(action.payload);
				})
			};
		case INIT_GET_DB_CACHE:
			return {
				...state,
				gettingDbCache: true
			};
		case DB_CACHED_USER:
			return {
				...state,
				gettingDbCache: false
			};
		case NO_FOUND_PLAYLISTS:
			return {
				...state,
				playlistSpinners: [],
				gettingDbCache: false,
				noFoundPlaylistsError: true
			};
    default:
			return {
				...state,
				noFoundPlaylistsError: false
			};
    }
}

export default UI;
