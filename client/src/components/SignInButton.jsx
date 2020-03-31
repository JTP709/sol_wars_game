import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { GoogleLogin } from 'react-google-login';
import { googleClientId } from '../application-data';
import { connect } from 'react-redux';
import { validateGoogleSignIn, signInFailure, signOutSuccess } from '../redux/actions';
import { getIsSignedIn } from '../redux/selectors'

const mapStateToProps = state => ({
  isSignedIn: getIsSignedIn(state)
});

const mapDispatchToProps = {
  validateGoogleSignIn,
  signInFailure,
  signOutSuccess
}

const SignIn = ({
  validateGoogleSignIn,
  signInFailure,
  isSignedIn
}) => {
  useEffect(() => {
    if (isSignedIn && Boolean(localStorage.getItem('token'))) history.push('/gamesetup');
  })
  const history = useHistory();

  const signInSuccessCallback = response => {
    localStorage.setItem('token', response.tokenId);
    validateGoogleSignIn(response);
  };
  
  const signInFailureCallback = () => {
    localStorage.removeItem('token');
    signInFailure();
  }

  return <GoogleLogin
    clientId={googleClientId}
    buttonText='Login with Google'
    onSuccess={signInSuccessCallback}
    onFailure={signInFailureCallback}
    cookiePolicy={'single_host_origin'}
    isSignedIn={true}
  />
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn)
