// import Redux from 'redux';
import {combineReducers} from 'redux';
import auth from './auth';
import playlists from './playlists';
import UI from './UI';

const rootReducer= combineReducers({ auth, playlists, UI });

export default rootReducer;
