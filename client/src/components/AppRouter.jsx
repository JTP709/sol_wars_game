import React from 'react';
import {
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn, getGameId } from '../redux/selectors';
import { resetGameId } from '../redux/actions';

import Home from './Home';
import HowToPlay from './HowToPlay';
import Login from './Login';
import SignOutButton from './SignOutButton';
import GameManagement from './GameManagement';
import WarRoom from './WarRoom';

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state),
  gameId: getGameId(state)
});

const mapDispatchToProps = {
  resetGameId
}

const AppRouter = ({ isSignedIn, gameId }) => {
  const isAuthenticated = isSignedIn && Boolean(localStorage.getItem('token'));
  const leaveGame = event => {
    event.preventDefault();
    resetGameId();
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
          <li>
            {
              gameId ? <LeaveGameButton/> : null
            }
          </li>
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
      </Switch>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
