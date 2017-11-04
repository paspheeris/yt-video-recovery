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
      const raw = action.payload;
      console.log(raw);
      console.log(raw.split('&'));
      const hashDict = raw.split('&').reduce((accum, fieldStr) => {
        let [key, value] = fieldStr.split('=');
        //remove the leading '#' from '#state'
        if (key[0] === '#') key = key.slice(1);
        accum[key] = value;
        return accum;
      }, {});
      console.log(hashDict);
      return {
        ...state,
        hash: action.payload
      };
    default:
      return state;
  }
}
export default users;