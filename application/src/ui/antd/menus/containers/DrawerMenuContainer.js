import {connect} from 'react-redux';

import {destroySession} from '../../../../state/actions';
import Auth from '../../../../lib/Auth';
import DrawerMenu from '../components/DrawerMenu';

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: Auth.isAuthTokenValid(state.session.get('authToken'), state.session.get('authExpires'))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    destroySession: (cb) => {
      dispatch(destroySession(cb));
    }
  }
}

const DrawerMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerMenu);

export default DrawerMenuContainer;
