import React from 'react';
import { useHistory } from 'react-router-dom';

import { GoogleLogin } from 'react-google-login';
import { googleClientId } from '../application-data';
import { connect } from 'react-redux';
import { validateGoogleSignIn, signInFailure, signOutSuccess } from '../redux/actions';

const mapDispatchToProps = {
  validateGoogleSignIn,
  signInFailure,
  signOutSuccess
}

const SignIn = ({
  validateGoogleSignIn,
  signInFailure,
}) => {
  let history = useHistory();

  const signInSuccessCallback = response => {
    localStorage.setItem('token', response.tokenId);
    validateGoogleSignIn(response);
    history.push('/');
  };
  
  const signInFailureCallback = () => {
    localStorage.removeItem('token');
    signInFailure();
    history.push('/');
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
  null,
  mapDispatchToProps
)(SignIn)
