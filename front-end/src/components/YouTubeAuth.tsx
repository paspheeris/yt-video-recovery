import * as React from 'react';

interface YouTubeAuthProps {
};
// interface GapiResponse {
//   result: {
//     kind: string,
//     "etag": string,
//     "nextPageToken": string,
//     "prevPageToken": string,
//     "pageInfo": {
//       "totalResults": number,
//       "resultsPerPage": number
//     },
//     "items": any[]
//   }
// }

class YouTubeAuth extends React.Component<YouTubeAuthProps> {
  clickHandler = () => {
    // Example 2: Use gapi.client.request(args) function
    var request = (window as any).gapi.client.request({
      'method': 'GET',
      'path': '/youtube/v3/channels',
      'params': { 'part': 'snippet', 'mine': 'true' }
    });
    // Execute the API request.
    request.execute(function (response: any) {
      console.log(response);
    });

    // var request = (window as any).gapi.client.youtube.channels.list({
    //   mine: true,
    //   part: 'snippet'
    // });
    // request.execute((res: any) => console.log(res));

    // (window as any).buildApiRequest('GET',
    //   '/youtube/v3/playlists',
    // );

    //   fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true')
    //     .then(res => res.json())
    //     .then(data => console.log(data));
    // handleAPILoaded();
    // // Define some variables used to remember state.
    // var playlistId: string, nextPageToken: string, prevPageToken: string;

    // // After the API loads, call a function to get the uploads playlist ID.
    // function handleAPILoaded() {
    //   requestUserUploadsPlaylistId();
    // }

    // // Call the Data API to retrieve the playlist ID that uniquely identifies the
    // // list of videos uploaded to the currently authenticated user's channel.
    // function requestUserUploadsPlaylistId() {
    //   // See https://developers.google.com/youtube/v3/docs/channels/list
    //   var request = (window as any).gapi.client.youtube.channels.list({
    //     mine: true,
    //     part: 'contentDetails'
    //   });
    //   request.execute(function (response: GapiResponse) {
    //     playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
    //     requestVideoPlaylist(playlistId);
    //   });
    // }

    // // Retrieve the list of videos in the specified playlist.
    // function requestVideoPlaylist(playlistId: string, pageToken?: string) {
    //   (window as any).$('#video-container').html('');
    //   var requestOptions = {
    //     playlistId: playlistId,
    //     part: 'snippet',
    //     maxResults: 10,
    //     pageToken
    //   };
    //   if (pageToken) {
    //     requestOptions.pageToken = pageToken;
    //   }
    //   var request = (window as any).gapi.client.youtube.playlistItems.list(requestOptions);
    //   request.execute(function (response: GapiResponse) {
    //     // Only show pagination buttons if there is a pagination token for the
    //     // next or previous page of results.
    //     nextPageToken = response.result.nextPageToken;
    //     var nextVis = nextPageToken ? 'visible' : 'hidden';
    //     (window as any).$('#next-button').css('visibility', nextVis);
    //     prevPageToken = response.result.prevPageToken
    //     var prevVis = prevPageToken ? 'visible' : 'hidden';
    //     (window as any).$('#prev-button').css('visibility', prevVis);

    //     var playlistItems = response.result.items;
    //     if (playlistItems) {
    //       (window as any).$.each(playlistItems, function (index, item) {
    //         displayResult(item.snippet);
    //       });
    //     } else {
    //       (window as any).$('#video-container').html('Sorry you have no uploaded videos');
    //     }
    //   });
    // }

    // // Create a listing for a video.
    // function displayResult(videoSnippet) {
    //   var title = videoSnippet.title;
    //   var videoId = videoSnippet.resourceId.videoId;
    //   (window as any).$('#video-container').append('<p>' + title + ' - ' + videoId + '</p>');
    // }

    // // Retrieve the next page of videos in the playlist.
    // function nextPage() {
    //   requestVideoPlaylist(playlistId, nextPageToken);
    // }

    // // Retrieve the previous page of videos in the playlist.
    // function previousPage() {
    //   requestVideoPlaylist(playlistId, prevPageToken);
    // }
  }
  render() {
    return (
      <div>
        <button onClick={this.clickHandler} />
      </div>
    );
  }
}

export default YouTubeAuth;
