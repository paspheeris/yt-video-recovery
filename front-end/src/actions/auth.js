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
