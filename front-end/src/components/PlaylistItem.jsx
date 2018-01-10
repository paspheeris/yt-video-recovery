import React from 'react';
import { Item, Loader } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

function PlaylistItem({plMetadata, showSpinner}) {
	const { deletedCount } = plMetadata;
	return (
		<Item as={Link} to={`/playlist/${plMetadata.title}`}
					onClick={scrollToTop}>
				<Item.Image size='small' src={plMetadata.thumbnail.url} />

				<Item.Content>
					<Item.Header >{plMetadata.title}</Item.Header>
					<Item.Description>
						<span>Videos: {plMetadata.videoCount}</span>
						<br />
						<span>Deleted Videos: {deletedCount}</span>
						<br />
						{ deletedCount > 0 &&
							<span>Recovered Titles: {plMetadata.recoveredCount}</span> }
					</Item.Description>
				</Item.Content>
						<Loader active={showSpinner} inline>Updating Playlist...</Loader>
			</Item>
	)
}
const scrollToTop = _ => {
	window.scrollTo(0, 0);
}

export default PlaylistItem;
