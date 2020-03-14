import {compose} from 'redux';
import {connect} from 'react-redux';

import {sessionHydrate} from '../../../../state/actions';
import withSplashScreen from '../lib/withSplashScreen';

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    sessionHydrate: (data) => {
      dispatch(sessionHydrate(data));
    }
  }
}

const withSplashScreenContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSplashScreen);

export default withSplashScreenContainer;
