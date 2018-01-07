import React from 'react';
import { Icon, Image as ImageComponent, Item } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

function Video({video}) {
	if(video.archive === undefined) {
		// Non-removed video
		return (
			<Item>
				<Item.Image size='small' src={video.snippet.thumbnails.medium.url} />
				<Item.Content>
					<Item.Header >{video.snippet.title}</Item.Header>
					{/* <Item.Description>asdf</Item.Description> */}
					{/* <Item.Extra>
							<Icon color='green' name='check' /> 121 Votes
							</Item.Extra> */}
				</Item.Content>
			</Item>
		)
	} else if (video.archive && video.archive.available === true
						 && video.archive.snapshot !== 'staleSnapshot') {
		// Removed video, but one for which a title was recovered
	} else {
		// Removed video, for which nothing was recovered
	}
	/* return (
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
		 )*/
}

export default Video;
