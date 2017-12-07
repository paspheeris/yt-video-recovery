import { ASYNC_START, ASYNC_END } from './actions/constants.js';

// Handles Promises that have been dispatched
export const promiseMiddleware = store => next => action => {
    if (!action.payload || typeof action.payload.then !== 'function') {
        next(action);
    }
    else {
        store.dispatch({ type: ASYNC_START, subtype: action.type });
        action.payload.then(response => {
            return response.json();
        })
            .then(json => {
                store.dispatch({ type: `${action.type}_SUCCESS`, payload: json, meta: action.meta });
                store.dispatch({ type: ASYNC_END, subtype: action.type });
            })
            .catch(error => {
                console.log(error);
                store.dispatch({ type: `${action.type}_FAILURE`, payload: { error }, meta: action.meta });
                store.dispatch({ type: ASYNC_END, subtype: action.type });
            });
    }
}
