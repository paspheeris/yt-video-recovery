import React from 'react';
import {
	Container
} from 'semantic-ui-react';

const About = () => {
	return (
		<Container>
			<h3>How it works</h3>
			<p>
				This site takes advantage of the fact that when a YouTube video is
				removed, even though all associated data is removed, the video's URL
				is preserved if it was saved in a playlist or your favorites list.
				Using this URL, it is possible to check if an archived version of the
				page exists on the <a href='https://archive.org/' target='_blank'
													 rel="noopener noreferrer">
				Internet Archive</a>.
				If it does, then the title can be recovered, and you can then find
				a duplicate upload of the video.
			</p>
			<p>
				Unfortunately, not all removed videos had an archive made before they
				were removed. The more popular a video was, and the more that it was
				linked to, the more likely it is that an archived snapshot exists. In
				testing, around a third of removed videos were able to be recovered 
				using the internet archive.
			</p>
			<h3>Protecting your credentials</h3>
			<p>
				This site
				uses <a href='https://en.wikipedia.org/wiki/OAuth' target='_blank'
						 rel="noopener noreferrer">
					OAuth
				</a> to access your YouTube account data. This has two advantages:
				First, there's no need to register for an account, come up with a
				username and password, etc. Second, because all authentication is done
				through YouTube itself, and this site never sees your password, you can
				rest easy in the knowledge that your account credentials are secure.
			</p>
		</Container>
	)
}
export default About;
