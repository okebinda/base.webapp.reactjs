import {connect} from 'react-redux';

import RegisterStep1Screen from '../components/RegisterStep1Screen';
import Auth from '../../../../../lib/Auth';

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: Auth.isAuthTokenValid(state.session.get('authToken'), state.session.get('authExpires'))
  }
}

const RegisterStep1ScreenContainer = connect(
  mapStateToProps
)(RegisterStep1Screen);

export default RegisterStep1ScreenContainer;
