import React from 'react';
import { Icon, Image as ImageComponent, Item } from 'semantic-ui-react';

function PlaylistItem({plMetadata}) {
	console.log(plMetadata);
	return (
		<Item>
				<Item.Image size='small' src={plMetadata.thumbnail.url} />

				<Item.Content>
					<Item.Header as='a'>{plMetadata.title}</Item.Header>
					<Item.Description>asdf</Item.Description>
					<Item.Extra>
						<Icon color='green' name='check' /> 121 Votes
					</Item.Extra>
				</Item.Content>
			</Item>
	)
}

export default PlaylistItem;
