import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';

import store from './store';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import Test from './components/Test';
import Profile from './components/Profile';
import About from './components/About';
import Playlist from './components/Playlist';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            {/* <NavBar /> */}
						<Route path='/' component={NavBar} />
            <Switch>
							<Route exact path="/" component={LandingPage} />
							<Route path="/profile/:state?/:access_token?/:token_type?/:expires_in?/:scope?" component={Profile} />
							<Route path='/test' component={Test} />
							<Route path='/about' component={About} />
							<Route path='/playlist/*' component={Playlist} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
