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
                <div>
                    Your Playlists
                    {this.props.summaries && this.props.summaries.map(summary => {
                         return <div>{summary.title}</div>
                    })}
                </div>
               <button onClick={this.getPlaylists}>
                 get playlists ttiels promise
               </button>
            </div>
        );
    }
    getPlaylists = () => {
        this.props.getPlaylists();
    }
}

function mapStateToProps(state, ownProps) {
    return {
        hash: ownProps.location.hash,
        history: ownProps.history,
        access_token: state.auth.access_token,
        summaries: state.playlists.summaries
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        parseHash,
        getPlaylists: YT.getPlaylists
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
