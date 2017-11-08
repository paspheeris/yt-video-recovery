// import * as Redux from 'redux';
// attempti
import { AuthActionInterface, typeKeys } from '.././actions/auth';
import { parseAuthHash } from '.././utils/auth';
import { AuthHash } from '.././global.d';

const InitState = {

};
type InitState = {} | AuthHash;

function users(state: InitState = InitState,
               action: AuthActionInterface): InitState {
    switch (action.type) {
        case typeKeys.PARSE_HASH:
            console.log(action.payload);
            //console.log(parseAuthHash(action.payload.hash));
            const { rawHash, access_token, token_type, expires_in, scope } = parseAuthHash(action.payload.hash);
            return {
                ...state,
                rawHash,
                access_token,
                token_type,
                expires_in,
                expires_at: expires_in + action.payload.timeReceived,
                scope
            };
        default:
            return state;
    }
}
export default users;
