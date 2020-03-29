import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../redux/selectors';

import Home from './Home';
import SignIn from './SignIn';

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state)
})

function About() {
  return <h2>About</h2>
}

function Users() {
  return <h2>Users</h2>
}

const AppRouter = ({ isSignedIn }) => {
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
              <SignIn />
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/about" >
            { !isAuthenticated ? <Redirect to="/" /> : <About /> }          
          </Route>
          <Route path="/users" >
            { !isAuthenticated ? <Redirect to="/" /> : <Users /> }
          </Route>
        </Switch>

      </div>
    </Router>
  )
}

export default connect(mapStateToProps)(AppRouter);
