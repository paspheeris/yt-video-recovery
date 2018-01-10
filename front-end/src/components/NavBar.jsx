import React from 'react';
import { oauthSignIn } from '.././utils/auth';
import { Menu, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import {signOut} from '../actions/auth';

class NavBar extends React.Component {
	isLoggedIn = _ => {
		return this.props.access_token && this.props.expiresAt > Date.now();
	}
	logInOrOut = _ => {
		if(this.isLoggedIn()) {
			this.props.signOut();
			this.props.history.push('/');
		} else oauthSignIn();
	}
  render() {
		const { activeItem } = this.props;
    return (
			<Menu fluid className='navbar'>
        <Menu.Item name='home' as={Link} active={activeItem === '/'} to='/'>
					Home
        </Menu.Item>

        <Menu.Item name='about' as={Link} active={activeItem === '/about'} to='/about'>
					About
        </Menu.Item>

        <Menu.Item name='profile' as={Link} active={activeItem === '/profile'}
					to='/profile'
				>
					Profile
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item name='signIn'
					onClick={this.logInOrOut}>
						{this.isLoggedIn() ? 'Sign Out' : 'Sign In'}
          </Menu.Item>

          <Menu.Item name='github'
						href='https://github.com/paspheeris/yt-video-recovery'
						target='_blank'>
           <Icon name='github' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

function mapStateToProps(state, ownProps) {
	return {
		hash: ownProps.location.hash,
		history: ownProps.history,
		access_token: state.auth.access_token,
		expiresAt: state.auth.expires_at,
		activeItem: ownProps.location.pathname
		/* summaries: state.playlists.summaries*/
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		signOut
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
