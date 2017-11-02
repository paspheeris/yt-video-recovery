import * as React from 'react';
import YouTubeAuth from './components/YouTubeAuth';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/profile" component={Profile} />
            <YouTubeAuth />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
