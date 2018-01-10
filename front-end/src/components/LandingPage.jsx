import React from 'react';
import {
	Header,
	Grid,
	Image
} from 'semantic-ui-react';
import deleted_vids from '../deleted_vids.png';

class LandingPage extends React.Component {

  render() {
    return (
			<div>
			<Header as='h1' textAlign='center'>YouTube Video Title Recovery</Header>
			<br />
			<Grid container stackable divided='vertically'>
				<Grid.Row columns={2}>
					<Grid.Column>
						<Image fluid src={deleted_vids} />
					</Grid.Column>
					<Grid.Column>
						<Header textAlign='left' as='h2' >
							Hate losing your favorite videos?
						</Header>
						<p>
							When a video is removed from YouTube, all associated data is also
							removed. Even if the video was saved in your favorites or in
							a playlist, the title is gone, and you have no chance to find
							a duplicate upload.
						</p>
						<br />
						<p>This site uses the Internet Archive to help you recover the
					 		 titles of your favorite videos that have been removed from
							 YouTube.
						</p>
						<br />
						<p>Click 'Sign In' to login with your YouTube account and get
							started, or click 'About' to learn more about how this site
							works.
						</p>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			</div>
    );
  }
}

export default LandingPage;
