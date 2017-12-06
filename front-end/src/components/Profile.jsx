import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';
import { YT } from '.././actions/asyncActions';

class Profile extends React.Component {
    componentDidMount() {
        if(this.props.hash) {
          // Dispatch the hash to be parsed and stored
          this.props.parseHash(this.props.hash, Date.now());
        }
        // Redirect from the url with the hash to the clean /profile url
        this.props.history.push('/profile');
    }
    render() {
        return (
            <div>
                hello from the Profile
                wtf
                <button onClick={this.handleGoogleCall}>
                    Calling Google Api
                </button>
                <button onClick={this.getPlaylistsTitles}>
                    Get playlists titles
                </button>
                <button onClick={this.getPlaylistsTitlesPromise}>
                    get playlists ttiels promise
            </button>
            </div>
        );
    }
    handleGoogleCall = () => {
        fetch(`https://www.googleapis.com/youtube/v3/channels?access_token=${this.props.access_token}&part=snippet&mine=true`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    }
    getPlaylistsTitles = () => {
        fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&mine=true&access_token=${this.props.access_token}`)
          .then(res => res.json())
          .then(data => console.log(data))
          .catch(error => console.log(error));

    }
    getPlaylistsTitlesPromise = () => {
        this.props.getPlaylists();
    }
}

function mapStateToProps(state, ownProps) {
    return {
        hash: ownProps.location.hash,
        history: ownProps.history,
        access_token: state.auth.access_token
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        parseHash,
        getPlaylists: YT.getPlaylists
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
