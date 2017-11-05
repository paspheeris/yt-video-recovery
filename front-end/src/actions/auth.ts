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
  payload: AuthActionPayload
}
interface AuthActionPayload {
  hash: string;
  timeReceived: number;
}

// export declare function parseHash = (hash: string) => FSA<typeKeys, string>;\
// export function parseHash(hash: string): FSA<typeKeys, string>;
export function parseHash(hash: string, timeReceived: number): FSA<typeKeys, AuthActionPayload> {
  return {
    type: typeKeys.PARSE_HASH,
    payload: {
      hash,
      timeReceived
    }
  };
}