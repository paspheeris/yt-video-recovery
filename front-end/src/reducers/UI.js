import {getPlId} from '../utils/yt.js';
import {
	DB_CACHED_USERS,
	PL_METADATA,
	SINGLE_PLAYLIST
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
			break;
		case SINGLE_PLAYLIST:
			return {
				...state,
				playlistSpinners: state.playlistSpinners.filter(id => {
					return id !== getPlId(action.payload);
				})
			}
    default:
    return state;
    }
}

export default UI;
