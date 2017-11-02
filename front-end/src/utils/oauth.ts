const scope: string = 'https://www.googleapis.com/auth/youtube';
const redirectURI: string = 'https://localhost:3000/profile';
const clientID: string = '473384173845-k0go9oir9g6qsto4tmugfl8l5fcgvpc3.apps.googleusercontent.com';

/* Google's oauth flow doesn't allow CORS, so a form must be created and appended to the page.
   T oauthSignIn() initiaites a redirect, and after permission granting, redirects to redirectURI.
   The JWT is put in the url of the redirectURI, where it can then be parsed.
   src: https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps */
export function oauthSignIn() {
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