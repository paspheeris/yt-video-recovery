import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { parseHash } from '.././actions/auth';

class Profile extends React.Component {
    componentDidMount() {
        this.props.parseHash(this.props.hash, Date.now());
    }
    render() {
        return (
            <div>
                hello from the Profile
      </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        hash: ownProps.location.hash,
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        parseHash,
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
