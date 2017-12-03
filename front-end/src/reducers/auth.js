import { authActions } from '.././actions/auth';
import { parseAuthHash } from '.././utils/auth';

function users(state = {},
               action) {
                   switch (action.type) {
                   case authActions.PARSE_HASH:
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
