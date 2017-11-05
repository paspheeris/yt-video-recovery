// import * as Redux from 'redux';
import { AuthActionInterface, typeKeys } from '.././actions/auth';
import { parseAuthHash } from '.././utils/auth';

const InitState = {

};
interface InitState {
  rawHash?: string;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
  scope?: string;
}
function users(state: InitState = InitState, action: AuthActionInterface): InitState {
  switch (action.type) {
    case typeKeys.PARSE_HASH:
      console.log(parseAuthHash(action.payload.hash));
      const { rawHash, access_token, token_type, expires_in, scope } = parseAuthHash(action.payload.hash);
      return {
        ...state,
        rawHash,
        access_token,
        token_type,
        expires_in,
        expires_at: expires_in ? expires_in + action.payload.timeReceived : action.payload.timeReceived,
        scope
      };
    default:
      return state;
  }
}
export default users;