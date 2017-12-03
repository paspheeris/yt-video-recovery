import React from 'react';
import { oauthSignIn } from '.././utils/auth';

class YouTubeAuth extends React.Component{

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
