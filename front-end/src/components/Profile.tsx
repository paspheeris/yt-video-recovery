import * as React from 'react';
import { withRouter } from 'react-router';
// import * as RR from 'react-router';
import { connect } from 'react-redux';
import * as Redux from 'redux';
// import { bindActionCreators } from 'react-redux';
import { parseHash, AuthActionInterface } from '.././actions/auth';
// import { FSA } from '.././global.d';

interface PropTypes {
  hash: string;
  parseHash: (hash: string, timeStamp: number) => void;
}

class Profile extends React.Component<PropTypes> {
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

function mapStateToProps(state: any, ownProps: any) {
  return {
    hash: ownProps.location.hash,
  };
}
// Redux.Dispatch<AuthActionInterface>
function mapDispatchToProps(dispatch: Redux.Dispatch<AuthActionInterface>) {
  return Redux.bindActionCreators({
    parseHash,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile as any));
// export default connect(mapStateToProps, mapDispatchToProps)(Profile);
