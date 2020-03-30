import React from 'react';
import { useHistory } from 'react-router-dom';

import { GoogleLogout } from 'react-google-login';
import { googleClientId } from '../application-data';
import { connect } from 'react-redux';
import { signOutSuccess } from '../redux/actions';

const SignIn = ({
  signOutSuccess
}) => {
  let history = useHistory();

  const signOutSuccessCallback = () => {
    localStorage.removeItem('token');
    signOutSuccess();
    history.push('/');
  }

  return <GoogleLogout
    clientId={googleClientId}
    buttonText="Logout"
    onLogoutSuccess={signOutSuccessCallback}
    render={renderProps => (
      <button
        onClick={renderProps.onClick}
        disabled={renderProps.disabled}
      >
        Log Out
      </button>
    )}
  />
}

export default connect(
  null,
  { signOutSuccess }
)(SignIn)
