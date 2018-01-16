import io from 'socket.io-client';

import store from '../store';
import {
	DB_CACHED_USER,
	PL_METADATA,
	SINGLE_PLAYLIST,
	NO_FOUND_PLAYLISTS
} from './constants';


// const socket = io('https://localhost:7777');
const socket = process.env && process.env.NODE_ENV === 'development'
			? io('https://localhost:7777')
			: io('https://boiling-atoll-21824.herokuapp.com/');

// socket.on('connect', function(){
//     console.log('connected ont he front end in socket.js');
// });

// socket.on('testDataReceived', d => console.log('res from serv', d));
// socket.on('first50', data => console.log('first50 from server', data));
// socket.on('allNewVideos', data => console.log('allNewVideos from server', data));
// socket.on('pleasePrint', d => console.log('From backend \n', d));
socket.on('getDbCache', userObj => store.dispatch({type: DB_CACHED_USER,
																									 payload: userObj}));

socket.on('plMetadata', plMetadata => store.dispatch({type: PL_METADATA,
																											payload: plMetadata}));
socket.on('singlePlaylist', singlePlaylist => store.dispatch({
	type: SINGLE_PLAYLIST,
	payload: singlePlaylist
}));
// socket.on('invalidToken', d => console.log('Invalid Token', d));
socket.on('noFoundPlaylists', d => store.dispatch({type: NO_FOUND_PLAYLISTS}));

export default socket;
