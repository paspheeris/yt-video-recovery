import * as React from 'react';
import { oauthSignIn } from '.././utils/oauth';

interface YouTubeAuthProps {
}

class YouTubeAuth extends React.Component<YouTubeAuthProps> {

  handleClick = () => {

    oauthSignIn();

  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
      </div>
    );
  }
}

export default YouTubeAuth;
