import * as React from 'react';

interface YouTubeAuthProps {
};


class YouTubeAuth extends React.Component<YouTubeAuthProps> {

  handleClick = () => {
    fetch(`https://accounts.google.com/o/oauth2/v2/auth?
    scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&
    include_granted_scopes=true&
    state=state_parameter_passthrough_value&
    redirect_uri=http%3A%2F%2Flocalhost%2Foauth2callback&
    response_type=token&
    client_id=client_id`);
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
