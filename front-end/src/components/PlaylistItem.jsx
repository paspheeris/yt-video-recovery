import React from 'react';
import { Icon, Item } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

function PlaylistItem({plMetadata}) {
	const { deletedCount } = plMetadata;
	return (
		<Item as={Link} to={`/playlist/${plMetadata.title}`}>
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
					<Item.Extra>
						<Icon color='green' name='check' /> 121 Votes
					</Item.Extra>
				</Item.Content>
			</Item>
	)
}

export default PlaylistItem;
