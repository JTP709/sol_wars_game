import React from 'react';
import {
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn, getGameId } from '../redux/selectors';
import { resetGameState } from '../redux/actions';

import Home from './Home';
import HowToPlay from './HowToPlay';
import Login from './Login';
import SignOutButton from './SignOutButton';
import GameManagement from './GameManagement';
import WarRoom from './WarRoom';
import MyAccount from './MyAccount';

import socket from '../socket/socket';

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state),
  gameId: getGameId(state)
});

const mapDispatchToProps = {
  resetGameState
}

const AppRouter = ({ isSignedIn, gameId, resetGameState }) => {
  const isAuthenticated = isSignedIn && Boolean(localStorage.getItem('token'));
  const leaveGame = event => {
    event.preventDefault();
    socket.emit('leaveGame');
    resetGameState();
  }

  const LeaveGameButton = () => <button onClick={ leaveGame }>Leave Game</button>
  
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/howtoplay'>How To Play</Link>
          </li>
          <li>
            <Link to='/gamesetup'>Game Setup</Link>
          </li>
          <li>
            <Link to='/warroom'>War Room</Link>
          </li>
          <li>
            {
              !isAuthenticated ? <Link to='/login'>Sign In</Link> : <SignOutButton />
            }
          </li>
          {
            isAuthenticated ? <Link to='/account'>My Account</Link> : null
          }
          {
            gameId ? <li><LeaveGameButton/></li> : null
          }
        </ul>
      </nav>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/howtoplay" component={HowToPlay} />
        {/* Authenticated Routes */}
        <Route path="/gamesetup" >
          {
            !isAuthenticated 
              ? <Redirect to="/login" /> 
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
        <Route path='/account' >
          {
            !isAuthenticated
              ? <Redirect to='/login' />
              : <MyAccount />
          }
        </Route>
      </Switch>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
