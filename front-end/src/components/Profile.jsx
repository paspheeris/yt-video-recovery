import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';
import { YT } from '.././actions/asyncActions';
import socket from '.././actions/socket.js';

class Profile extends React.Component {
componentDidMount() {
	if(this.props.hash) {
		// Dispatch the hash to be parsed and stored
		this.props.parseHash(this.props.hash, Date.now());
	}
	// Redirect from the url with the hash to the clean /profile url
	this.props.history.push('/profile');
}
	render() {
	return (
		<div>
			hello from the Profile
			<div>
				Your Playlists
				{this.props.summaries && this.props.summaries.map(summary => {
							return <div>{summary.title}</div>
				})}
			</div>
			<button onClick={this.getPlaylists}>
				get playlists ttiels promise
			</button>
			<button onClick={this.getVideos}>
				get videos ttiels promise
			</button>
			<button onClick={this.socketTest}>
				socketTest
			</button>
			<button onClick={this.sendToken}>
				send token to backend
			</button>
			<button onClick={this.waybackTest}>
				waybackTest
			</button>
	</div>
);
}
	getPlaylists = () => {
		this.props.getPlaylists();
	}
	getVideos = () => {
		this.props.getVideos("PLrkcX2uLOH-gXi0fpN5eQRdVatlqozQ0N");
	}
	socketTest = () => {
		console.log('socket send');
		socket.emit('test', 'testData');
	}
	sendToken = () => {
		console.log('Sending access token to the backend.');
		// Send token to the backend for authentication
		if(!this.props.access_token) {
				console.log('Must log in first!');
				return;
		}

		/* socket.emit('accessToken', this.props.access_token);*/
		socket.emit('initialLogin', this.props.access_token);

	}
	waybackTest = () => {
		/* const videoId = '-CofLWgdAm4';*/
		const videoId = 'zQ05vleQZOQ'; // Video with inconsistent results
		console.log(`Sending videoId ${videoId} for waybackTest`);
		socket.emit('waybackTest', videoId);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		hash: ownProps.location.hash,
		history: ownProps.history,
		access_token: state.auth.access_token,
		summaries: state.playlists.summaries
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	parseHash,
	getPlaylists: YT.getPlaylists,
	getVideos: YT.getVideosFromPlaylists
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
