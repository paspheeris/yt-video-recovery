import * as React from 'react';

interface YouTubeAuthProps {
}

class YouTubeAuth extends React.Component<YouTubeAuthProps> {

  handleClick = () => {
    const scope: string = 'https://www.googleapis.com/auth/youtube';
    const redirectURI: string = 'https://localhost:3000';
    const clientID: string = '473384173845-k0go9oir9g6qsto4tmugfl8l5fcgvpc3.apps.googleusercontent.com';
    // const config: object = {
    //   method: 'POST',
    //   mode: 'cors'
    // }
    function oauthSignIn() {
      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

      // Create <form> element to submit parameters to OAuth 2.0 endpoint.
      var form = document.createElement('form');
      form.setAttribute('method', 'GET'); // Send as a GET request.
      form.setAttribute('action', oauth2Endpoint);

      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {
        'client_id': `${clientID}`,
        'redirect_uri': `${redirectURI}`,
        'response_type': 'token',
        'scope': `${scope}`,
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
      };

      // Add form parameters as hidden input values.
      for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
      }

      // Add form to page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form);
      form.submit();
    }
    oauthSignIn();

    // fetch(`https://accounts.google.com/o/oauth2/v2/auth?
    // scope=${scope}&
    // include_granted_scopes=true&
    // state=state_parameter_passthrough_value&
    // redirect_uri=${redirectURI}&
    // response_type=token&
    // client_id=${clientID}`, config)
    //   .then(res => res.json())
    //   .then((json: JSON) => console.log(json))
    //   .catch((e: Error) => console.log(e));
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
