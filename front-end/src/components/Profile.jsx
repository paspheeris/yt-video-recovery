import React from 'react';
import socket from '.././actions/socket.js';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';
import { Item, Container,
				 Header, Message } from 'semantic-ui-react';
import PlaylistItem from './PlaylistItem';
import {Link} from 'react-router-dom';
import recycle from '../recycle.svg';

class Profile extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	componentDidMount() {
		if(this.props.hash) {
			// Dispatch the hash to be parsed and stored
			this.props.parseHash(this.props.hash, Date.now());
			// Redirect from the url with the hash to the clean /profile url
			this.props.history.push('/profile');
		}
	}
	componentDidUpdate(prevProps, prevState) {
		// Perform fetches to the backend once the access token comes through
		if (!prevProps.access_token && this.props.access_token) {
			const { lastLogin } = this.props;
			console.log('lastLogin', lastLogin);
			// If the last login was within 12hrs, just fetch data cached in the DB
			/* 43200000*/
			if(this.props.msSinceLastLogin < 1500) {
				console.log('emiting getDbCache in Profile componentDidMount');
				socket.emit('getDbCache', this.props.access_token);
			}
			// Else, if it's the first login, or firtst in 12hrs, do a full req
			else {
				console.log('emitting initialLogin in Profile componentDidMount');
				socket.emit('initialLogin', this.props.access_token);
			}
			}
	}
	isLoggedIn = _ => {
		return this.props.access_token;
	}
	sessionIsExpired = _ => {
		return this.props.access_token && this.props.expiresAt < Date.now();
	}
	scrollToTop = _ => {
		window.scrollTo(0, 0);
	}
	render() {
			if (!this.isLoggedIn()) return (
				<Container>
					<Message warning>
						<Message.Header>Please Login.</Message.Header>
						<p>You must be logged in to view your profile.</p>
					</Message>
				</Container>
		)
		return (
			<Container>
				Hello from the Profile
				<button onClick={this.getDbCache}>getDbCache</button>
				{this.sessionIsExpired() &&
					<Message warning>
						<Message.Header>Session Expired.</Message.Header>
						<p>Please login again to update your profile.</p>
					</Message>
				}
			<Header as='h2' >Your Playlists</Header>
				<Item.Group divided>
					{this.props.plsMetadata && this.props.plsMetadata.map(( pl, i ) => {
						return <PlaylistItem key={i} plMetadata={pl} />
					})}
				</Item.Group>
			<Header as='h2' >Removed Videos</Header>
			<Item.Group divided>
				<Item as={Link} to='/playlist/recoveredTitles'
					onClick={this.scrollToTop}>
					<img className='ui small image' src={recycle} alt='recycle-symbol' />
					<Item.Content>
						<Item.Header >All Recovered Titles</Item.Header>
						<Item.Description>
							<span>Deleted Videos: {this.props.deletedCount}</span>
							<br />
							<span>Recovered Titles: {this.props.recoveredCount}</span>
						</Item.Description>
					</Item.Content>
				</Item>
			</Item.Group>
			<br />
			</Container>
  )}

	getDbCache = _ => {
		socket.emit('getDbCache', this.props.access_token);
	}
}

function mapStateToProps(state, ownProps) {
	const { metadata } = state.playlists;
	let deletedCount = 0;
	let recoveredCount = 0;
	if (metadata) {
		const reduced = metadata.reduce((accum, pl) => {
			if(!pl.deletedCount) return accum;
			accum.deletedCount += pl.deletedCount;
			accum.recoveredCount += pl.recoveredCount;
			return accum;
		}, {deletedCount: 0, recoveredCount: 0})
		deletedCount = reduced.deletedCount;
		recoveredCount = reduced.recoveredCount;
	}
	return {
		hash: ownProps.location.hash,
		history: ownProps.history,
		videos: state.playlists.videos,
		plsMetadata: metadata,
		access_token: state.auth.access_token,
		expiresAt: state.auth.expires_at,
		lastLogin: state.auth.lastLogin,
		msSinceLastLogin: state.auth.msSinceLastLogin,
		deletedCount,
		recoveredCount
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	parseHash,
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
