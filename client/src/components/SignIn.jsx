import React from 'react';
import { useHistory } from 'react-router-dom';

import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { googleCLientId } from '../application-data';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../redux/selectors';
import { signInSuccess, signInFailure, signOutSuccess } from '../redux/actions';

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state)
})

const mapDispatchToProps = {
  signInSuccess,
  signInFailure,
  signOutSuccess
}

const SignIn = ({
  isSignedIn,
  signInSuccess,
  signInFailure,
  signOutSuccess
}) => {
  let history = useHistory();

  const signInSuccessCallback = response => {
    localStorage.setItem('token', response.tokenId);
    signInSuccess();
    history.push('/');
    // const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.tokenId}`;
    
    // fetch(url)
    // .then(res => res.text())
    // .then(res => console.log(res))
    // .catch(err => console.error(err));
  };
  
  const signInFailureCallback = () => {
    localStorage.removeItem('token');
    signInFailure();
    history.push('/');
  }

  const signOutSuccessCallback = () => {
    localStorage.removeItem('token');
    signOutSuccess();
    history.push('/');
  }

  if(!isSignedIn && !localStorage.getItem('token')) {
    return (<GoogleLogin
      clientId={googleCLientId}
      buttonText='Login with Google'
      onSuccess={signInSuccessCallback}
      onFailure={signInFailureCallback}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
    />)
  } else {
    return (<GoogleLogout
      clientId={googleCLientId}
      buttonText="Logout"
      onLogoutSuccess={signOutSuccessCallback}
    />)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn)

