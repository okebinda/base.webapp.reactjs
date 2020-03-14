import {connect} from 'react-redux';

import PrivateRoute from '../components/PrivateRoute';
import Auth from '../../../../lib/Auth';

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: Auth.isAuthTokenValid(state.session.get('authToken'), state.session.get('authExpires'))
  }
}

const PrivateRouteContainer = connect(
  mapStateToProps
)(PrivateRoute);

export default PrivateRouteContainer;
