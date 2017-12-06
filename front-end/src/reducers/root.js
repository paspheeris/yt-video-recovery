// import Redux from 'redux';
import {combineReducers} from 'redux';
import auth from './auth';
import playlists from './playlists';

const rootReducer= combineReducers({ auth, playlists });

export default rootReducer;
