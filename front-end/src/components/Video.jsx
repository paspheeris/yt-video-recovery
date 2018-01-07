import React from 'react';
import { Icon, Image as ImageComponent, Item,
				Label, Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import recycle from '../recycle.svg';

function Video({video}) {
	/* if(video.archive === undefined && !video.snippet.'
		 vids with a title of 'Private video are showing up here... one in the tup
		 playlist'
		 console.log(video);
		 }*/
	if(video.archive === undefined && video.snippet.thumbnails) {
		// Non-removed video
		const ytLink =
			`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;

		return (
			<Item>
				<Item.Image as='a' href={ytLink} target='_blank' size='small' src={video.snippet.thumbnails.medium.url} />
				<Item.Content>
					<Item.Header as='a' href={ytLink} target='_blank' >{video.snippet.title}</Item.Header>
					{/* <Item.Description>asdf</Item.Description> */}
					{/* <Item.Extra>
							<Icon color='green' name='check' /> 121 Votes
							</Item.Extra> */}
				</Item.Content>
			</Item>
		)
	} else if (video.archive && video.archive.available === true
						 && video.archive.title !== 'staleSnapshot') {
		// Removed video, but one for which a title was recovered
		const title = video.archive.title;
		const titleNoSpaces = title.split(' ').join('+');
		const ytSearchLink = `https://www.youtube.com/results?search_query=${titleNoSpaces}`;
		const googleSearchLink = `https://www.google.com/search?q=${titleNoSpaces}`;
		const vimeoSearchLink = `https://vimeo.com/search?q=${titleNoSpaces}`;
		return (
			<Item>
				{/* <Item.Image as='img' size='small' src='recycle.svg' /> */}
				<img className='ui small image' src={recycle} />
				<Item.Content>
					<Item.Header >[Recovered Video]</Item.Header>
					<br />
					<Item.Header >{title}</Item.Header>
					<Item.Description>
						<a href={ytSearchLink} target='_blank' >
							<Icon name='youtube' size='big' color='red' />
						</a>
						<a href={googleSearchLink} target='_blank' >
							<Icon name='google' size='big' color='blue'/>
						</a>
						<a href={vimeoSearchLink} target='_blank' >
							<Icon name='vimeo' size='big' color='teal'/>
						</a>
						<Label pointing='left'>Search for this title</Label>
						<br />
						{/* <Button>View Archived Snapshot</Button> */}
					</Item.Description>
					<Item.Extra>
						<a href={video.archive.url} target='_blank' >
							<Icon name='camera' size='big' />
						</a>
						<Label pointing='left'>View Archived Snapshot</Label>
					</Item.Extra> 
				</Item.Content>
			</Item>
		)
	} else {
		// Removed video, for which nothing was recovered
		return (
			false
		)
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
