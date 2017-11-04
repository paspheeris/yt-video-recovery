// import * as Redux from 'redux';
import { AuthActionInterface, typeKeys } from '.././actions/auth';

const InitState = {
};
interface InitState {
  hash?: string;
}
function users(state: InitState = InitState, action: AuthActionInterface): InitState {
  switch (action.type) {
    case typeKeys.PARSE_HASH:
      return {
        ...state,
        hash: action.payload
      };
    default:
      return state;
  }
}
export default users;