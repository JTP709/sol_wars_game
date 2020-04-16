import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn, getGameId } from '../redux/selectors';

import Home from './Home';
import Login from './Login';
import SignOutButton from './SignOutButton';
import GameManagement from './GameManagement';
import WarRoom from './WarRoom';

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state),
  gameId: getGameId(state)
})

function About() {
  return <h2>About</h2>
}

function Users() {
  return <h2>Users</h2>
}

const AppRouter = ({ isSignedIn, gameId }) => {
  const isAuthenticated = isSignedIn && Boolean(localStorage.getItem('token'));
  
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/users'>Users</Link>
            </li>
            <li>
              {
                !isAuthenticated ? <Link to='/login'>Sign In</Link> : <SignOutButton />
              }
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          {/* Authenticated Routes */}
          <Route path="/about" >
            { !isAuthenticated ? <Redirect to="/login" /> : <About /> }          
          </Route>
          <Route path="/users" >
            { !isAuthenticated ? <Redirect to="/login" /> : <Users /> }
          </Route>
          <Route path="/gamesetup" >
            {
              !isAuthenticated 
                ? <Redirect to="/login" /> 
                : gameId
                  ? <Redirect to='/warroom' />
                  : <GameManagement />
            }
          </Route>
          <Route path="/warroom" >
            {
              !isAuthenticated
                ? <Redirect to="/login" />
                : !gameId
                  ? <Redirect to='/gamesetup' />
                  : <WarRoom />
            }
          </Route>
        </Switch>

      </div>
    </Router>
  )
}

export default connect(mapStateToProps)(AppRouter);
