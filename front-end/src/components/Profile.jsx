import React from 'react';
import socket from '.././actions/socket.js';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';
import { Icon, Image as ImageComponent, Item, Container,
				 Header, Segment } from 'semantic-ui-react';
import PlaylistItem from './PlaylistItem';
import {Link} from 'react-router-dom';

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
		}
		// Redirect from the url with the hash to the clean /profile url
		this.props.history.push('/profile');
	}
	render() {
		return (
			<Container>
				Hello from the Profile
				<button onClick={this.getDbCache}>getDbCache</button>
			<Header as='h2' >Your Playlists</Header>
				<Item.Group divided>
					{this.props.plsMetadata && this.props.plsMetadata.map(( pl, i ) => {
						return <PlaylistItem key={i} plMetadata={pl} />
					})}
				</Item.Group>
			<Header as='h2' >Removed Videos</Header>
			<Item.Group divided>
				<Item as={Link} to='/playlist/recoveredTitles'>
					<Item.Image size='small' src='fds' />
					<Item.Content>
						<Item.Header as='a'>All Recovered Titles</Item.Header>
						<Item.Description>asdf</Item.Description>
						<Item.Extra>
							<Icon color='green' name='check' /> 121 Votes
						</Item.Extra>
					</Item.Content>
				</Item>
			</Item.Group>
			</Container>
  )}

	getDbCache = _ => {
		socket.emit('getDbCache', this.props.access_token);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		hash: ownProps.location.hash,
		history: ownProps.history,
		access_token: state.auth.access_token,
		videos: state.playlists.videos,
		plsMetadata: state.playlists.metadata
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	parseHash,
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
