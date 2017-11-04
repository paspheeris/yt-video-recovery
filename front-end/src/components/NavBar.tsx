import * as React from 'react';
import { oauthSignIn } from '.././utils/oauth';

class NavBar extends React.Component {

  render() {
    return (
      <div>
        hello from the NavBar
        <div onClick={oauthSignIn}>sign in</div>
      </div>
    );
  }
}

export default NavBar;