// import * as Redux from 'redux';
import { FSA } from '.././global.d';

// export type authAction = 'PARSE_HASH' | 'SignOut';
export enum typeKeys {
  PARSE_HASH = 'PARSE_HASH',
  SIGN_OUT = 'SIGN_OUT',
  _otheraction = '_otheraction'
}

export interface AuthActionInterface {
  type: typeKeys;
  payload: string;
}

// export declare function parseHash = (hash: string) => FSA<typeKeys, string>;\
// export function parseHash(hash: string): FSA<typeKeys, string>;
export function parseHash(hash: string): FSA<typeKeys, string> {
  return {
    type: typeKeys.PARSE_HASH,
    payload: hash
  };
}