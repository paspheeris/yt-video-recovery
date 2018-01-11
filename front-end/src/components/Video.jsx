import React from 'react';
import { Icon, Item, Label, Visibility} from 'semantic-ui-react';
import {hasRecoveredTitle} from '.././utils/yt';
import recycle from '../recycle.svg';


class Video extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgUrl: 'none'
		}
	}
  onScreenHandler = () => {
		this.setState({imgUrl: this.props.video.snippet.thumbnails.default.url})
		/* console.log(this);*/
  }
	render() {
		const video = this.props.video;
	if(video.archive === undefined && video.snippet &&
		 video.snippet.thumbnails && video.snippet.thumbnails.medium.url) {
		/* console.log(video);*/
		// Non-removed video
		const ytLink =
			`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;

		return (
			<Item>
				<Visibility fireOnMount={true} onTopVisible={this.onScreenHandler} />
				<Item.Image  as='a' href={ytLink} target='_blank' size='small' src={this.state.imgUrl} />
				{/* <Image src={'kj'} alt='video-icon'/> */}
				<Item.Content>
					<Item.Header as='a' href={ytLink} target='_blank' >{video.snippet.title}</Item.Header>
				</Item.Content>
			</Item>
		)
	} else if (hasRecoveredTitle(video)) {
		// Removed video, but one for which a title was recovered
		const title = video.archive.title;
		if(title === null || title === undefined) {
			return false;
		}
		const titleNoSpaces = title.split(' ').join('+');
		const ytSearchLink =
			`https://www.youtube.com/results?search_query=${titleNoSpaces}`;
		const googleSearchLink =
			`https://www.google.com/search?q=${titleNoSpaces}`;
		const vimeoSearchLink = `https://vimeo.com/search?q=${titleNoSpaces}`;
		return (
			<Item>
				<img className='ui small image' src={recycle} alt='recycle-symbol' />
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
	}
}
export default Video;
