import {connect} from 'react-redux';

import {createSession, destroySession} from '../../../../../state/actions';
import SessionTimeoutModal from '../components/SessionTimeoutModal';

const mapStateToProps = (state, ownProps) => {
  return {
    authToken: state.session.get('authToken'),
    authExpires: state.session.get('authExpires')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createSession: (data, cb) => {
      dispatch(createSession(data, cb));
    },
    destroySession: (cb) => {
      dispatch(destroySession(cb));
    }
  }
}

const SessionTimeoutModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionTimeoutModal);

export default SessionTimeoutModalContainer
