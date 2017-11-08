export interface ReduxStore {

}

export interface FSA<T, U> {
    type: T;
    payload?: U;
}

export interface AuthHash {
    rawHash: string;
    state: string;
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at?: number;
    scope: string;
}
