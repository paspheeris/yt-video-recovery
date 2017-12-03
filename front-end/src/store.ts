/* tslint:disable no-any */
import { createStore, compose, applyMiddleware } from 'redux';
import * as Redux from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from './reducers/root';
import thunk from 'redux-thunk';
import { loadState, saveState } from './utils/localStorage';

// If there is data saved under 'auth' in localStorage, use it
// in initialising the redux store
const lsSavedAuth = loadState('auth');

interface DefaultState {
    auth?: any;
}
const defaultState = {
    auth: lsSavedAuth ? lsSavedAuth : undefined
};

const enhancers = compose(
    applyMiddleware(thunk, reduxImmutableStateInvariant()),
    (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any) => f
);

const store: Redux.Store<DefaultState> = createStore(rootReducer, defaultState, enhancers);
// Save the auth to localStorage on any state change
store.subscribe(() => {
    // This stores state on every state change, so it should be debounced
    // if we ever add any actions to the app that fire rapidly and
    // update the store quickly
    saveState('auth', store.getState().auth);
});

if ((module as any).hot) {
    (module as any).hot.accept('./reducers/root', () => {
        const nextRootReducer = require('./reducers/root').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
