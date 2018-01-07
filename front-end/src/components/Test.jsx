import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';
import { YT } from '.././actions/asyncActions';
import socket from '.././actions/socket.js';

class Test extends React.Component {
	constructor() {
		super();
		this.state = {
			scrapeDebugVideoId: ''
		}
	}
componentDidMount() {
	if(this.props.hash) {
		// Dispatch the hash to be parsed and stored
		/* this.props.parseHash(this.props.hash, Date.now());*/
	}
	// Redirect from the url with the hash to the clean /profile url
	/* this.props.history.push('/profile');*/
}
	render() {
	return (
		<div>
			hello from the Test
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
				send token to backend for initial login
			</button>
			<button onClick={this.waybackTest}>
				waybackTest
			</button>
			<div>
				<span>Webarchive scrape debugging</span>
				<input type='text' placeholder='Enter a video Id...'
				 onChange={this.handleScrapeDebugInput} />
				<button onClick={this.submitScrapeDebug}>submit</button>
			</div>
	</div>
);
}
	handleScrapeDebugInput = (e) => {
		console.log(e.target.value);
		this.setState({ scrapeDebugVideoId: e.target.value });
	}
	submitScrapeDebug = () => {
		console.log(`Submitting ${this.state.scrapeDebugVideoId} for  scrape
								debugging.`)
		socket.emit('scrapeDebug', this.state.scrapeDebugVideoId);
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Test));
