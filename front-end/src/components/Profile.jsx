import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';

class Profile extends React.Component {
    componentDidMount() {
        this.props.parseHash(this.props.hash, Date.now());
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
            </div>
        );
    }
    handleGoogleCall = () => {
        /* fetch(`https://www.googleapis.com/youtube/v3/channels?access_token=ya29.Gl0ZBX8XWGuKKnQ-RayKwkM806-Q1vgHPdvdE_czat3R0IQ0--K9BL6zrZ_XIii2SWqMmoCDyvb5NN9vi96twDaPGdz-0eEbCBftc4h46ixW7CzmHOv3EHhiZC3baww&part=snippet&mine=true`)*/
 

        fetch(`https://www.googleapis.com/youtube/v3/channels?access_token=${this.props.access_token}&part=snippet&mine=true`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
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
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
