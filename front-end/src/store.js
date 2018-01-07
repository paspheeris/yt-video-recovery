import { createStore, compose, applyMiddleware } from 'redux';
import Redux from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from './reducers/root';
import thunk from 'redux-thunk';
import { loadState, saveState } from './utils/localStorage';
import { promiseMiddleware } from './promiseMiddleware';
// If there is data saved under 'auth' in localStorage, use it
// in initialising the redux store
const lsSavedAuth = loadState('auth');
const lsSavedPls = loadState('playlists');

const defaultState = {
  auth: lsSavedAuth ? lsSavedAuth : undefined,
	playlists: lsSavedPls ? lsSavedPls : undefined
};

const enhancers = compose(
    applyMiddleware(thunk, promiseMiddleware, reduxImmutableStateInvariant()),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
);

const store = createStore(rootReducer, defaultState, enhancers);
// Save the auth to localStorage on any state change
store.subscribe(() => {
    // This stores state on every state change, so it should be debounced
    // if we ever add any actions to the app that fire rapidly and
    // update the store quickly
    saveState('auth', store.getState().auth);
  saveState('playlists', store.getState().playlists);
});

if (module.hot) {
    module.hot.accept('./reducers/root', () => {
        const nextRootReducer = require('./reducers/root').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
