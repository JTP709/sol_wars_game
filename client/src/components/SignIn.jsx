import React from 'react';
import { useHistory } from 'react-router-dom';

import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { googleClientId } from '../application-data';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../redux/selectors';
import { validateGoogleSignIn, signInFailure, signOutSuccess } from '../redux/actions';

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state)
})

const mapDispatchToProps = {
  validateGoogleSignIn,
  signInFailure,
  signOutSuccess
}

const SignIn = ({
  isSignedIn,
  validateGoogleSignIn,
  signInFailure,
  signOutSuccess
}) => {
  let history = useHistory();

  const signInSuccessCallback = response => {
    localStorage.setItem('token', response.tokenId);
    validateGoogleSignIn(response);
    history.push('/');
  };
  
  const signInFailureCallback = () => {
    console.log('sign in failure callback')
    localStorage.removeItem('token');
    signInFailure();
    history.push('/');
  }

  const signOutSuccessCallback = () => {
    localStorage.removeItem('token');
    signOutSuccess();
    history.push('/');
  }

  if(!isSignedIn &&!localStorage.getItem('token')) {
    return (<GoogleLogin
      clientId={googleClientId}
      buttonText='Login with Google'
      onSuccess={signInSuccessCallback}
      onFailure={signInFailureCallback}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
    />)
  } else {
    return (<GoogleLogout
      clientId={googleClientId}
      buttonText="Logout"
      onLogoutSuccess={signOutSuccessCallback}
    />)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn)

