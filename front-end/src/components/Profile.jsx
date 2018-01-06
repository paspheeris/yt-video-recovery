import React from 'react';
import socket from '.././actions/socket.js';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';

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
			<div>
				Hello from the Profile
				<button onClick={this.getDbCache}>getDbCache</button>
			</div>
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
		/* summaries: state.playlists.summaries*/
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	parseHash,
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
