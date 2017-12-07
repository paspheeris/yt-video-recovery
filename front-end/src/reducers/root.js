// import Redux from 'redux';
import {combineReducers} from 'redux';
import auth from './auth';
import playlists from './playlists';
import videos from './videos';

const rootReducer= combineReducers({ auth, playlists, videos });

export default rootReducer;
