/* tslint:disable no-any */
import { createStore, compose, applyMiddleware } from 'redux';
import * as Redux from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import rootReducer from './reducers/root';
import thunk from 'redux-thunk';

interface DefaultState {

}
const defaultState = {};

const enhancers = compose(
  applyMiddleware(thunk, reduxImmutableStateInvariant()),
  (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any) => f
);

const store: Redux.Store<DefaultState> = createStore(rootReducer, defaultState, enhancers);
if ((module as any).hot) {
  (module as any).hot.accept('./reducers/root', () => {
    const nextRootReducer = require('./reducers/root').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
