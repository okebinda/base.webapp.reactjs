import {connect} from 'react-redux';

import LoginScreen from '../components/LoginScreen';
import Auth from '../../../../../lib/Auth';

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: Auth.isAuthTokenValid(state.session.get('authToken'), state.session.get('authExpires'))
  }
}

const LoginScreenContainer = connect(
  mapStateToProps
)(LoginScreen);

export default LoginScreenContainer;
