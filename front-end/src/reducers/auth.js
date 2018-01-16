import {
    SIGN_OUT
} from '../actions/constants';

import {
    authActions
} from '.././actions/auth';
import {
    parseAuthHash
} from '.././utils/auth';

function users(state = {lastLogin: 0}, action) {
    switch (action.type) {
        case authActions.PARSE_HASH:
            const {
                rawHash,
                access_token,
                token_type,
                expires_in,
                scope
            } = parseAuthHash(action.payload.hash);
            return {
                ...state,
                rawHash,
                access_token,
                token_type,
                expires_in,
                expires_at: expires_in + action.payload.timeReceived,
              scope,
							msSinceLastLogin: action.payload.timeReceived - state.lastLogin,
							lastLogin: action.payload.timeReceived
            };
        case SIGN_OUT:
      return {
				lastLogin: state.lastLogin
			};
        default:
            return state;
    }
}
export default users;
