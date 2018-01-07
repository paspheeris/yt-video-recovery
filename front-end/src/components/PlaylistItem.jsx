import React from 'react';
import { Icon, Image as ImageComponent, Item } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

function PlaylistItem({plMetadata}) {
	/* console.log(plMetadata);*/
	return (
		<Item as={Link} to={`/playlist/${plMetadata.title}`}>
				<Item.Image size='small' src={plMetadata.thumbnail.url} />

				<Item.Content>
					<Item.Header >{plMetadata.title}</Item.Header>
					<Item.Description>asdf</Item.Description>
					<Item.Extra>
						<Icon color='green' name='check' /> 121 Votes
					</Item.Extra>
				</Item.Content>
			</Item>
	)
}

export default PlaylistItem;
