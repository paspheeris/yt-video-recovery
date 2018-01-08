import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Item,
				 Header, Container } from 'semantic-ui-react';
import Video from './Video';
import {hasRecoveredTitle} from '.././utils/yt';

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
	let plTitle = ownProps.match.params[0];
	let videos;

	if(plTitle === 'recoveredTitles') {
		// Only recovered titles 'playlist'
		plTitle = 'Recovered Titles';
		videos = state.playlists.videos.reduce((accum, pl) => {
			const withTitles = pl.filter(vid => {
				return hasRecoveredTitle(vid);
			})
			return accum.concat(withTitles);
		}, []);
	}
	else {
		// Normal playlist
		const plMeta = state.playlists.metadata.find(pl => pl.title === plTitle);
		const plId = plMeta.id;
		videos = state.playlists.videos.find(pl => {
			return pl[0].snippet.playlistId === plId;
		});
	}
	return {
		/* hash: ownProps.location.hash,*/
		plTitle,
		// plId,
		// plMeta,
		videos
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Playlist));

