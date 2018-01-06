import React from 'react';
import YouTubeAuth from './components/YouTubeAuth';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';

import store from './store';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import Test from './components/Test';
import Profile from './components/Profile';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <NavBar />
            <Switch>
            <Route exact={true} path="/" component={LandingPage} />
              <Route path="/profile/:state?/:access_token?/:token_type?/:expires_in?/:scope?" component={Profile} />
							<Route path='/test' component={Test} />
              <YouTubeAuth />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
