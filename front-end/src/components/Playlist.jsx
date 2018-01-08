import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Item,
				 Header, Container } from 'semantic-ui-react';
import Video from './Video';

function Playlist({plTitle, videos}) {
	return (
		<Container>
			<Header as='h1' >{plTitle}</Header>
				<Item.Group divided>
					{videos && videos.map(( video, i ) => {
						 return <Video video={video} key={i} />
					})}
				</Item.Group>
		</Container>
	)
}

function mapStateToProps(state, ownProps) {
	const plTitle = ownProps.match.params[0];
	const plMeta = state.playlists.metadata.find(pl => pl.title === plTitle);
	const plId = plMeta.id;
	const videos = state.playlists.videos.find(pl => {
		return pl[0].snippet.playlistId === plId;
	});

	return {
		/* hash: ownProps.location.hash,*/
		plTitle,
		plId,
		plMeta,
		videos
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Playlist));

