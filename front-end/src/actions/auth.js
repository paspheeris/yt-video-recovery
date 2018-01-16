import {
	SIGN_OUT,
	INIT_GET_DB_CACHE
} from './constants';

export const authActions = {
    PARSE_HASH: 'PARSE_HASH',
    SIGN_OUT: 'SIGN_OUT'
};

export function parseHash(hash, timeReceived) {
    return {
        type: authActions.PARSE_HASH,
        payload: {
            hash,
            timeReceived
        }
    };
}
export function signOut() {
	return {
		type: SIGN_OUT
	}
}
export function initGetDbCache() {
	return {
		type: INIT_GET_DB_CACHE
	}
}
