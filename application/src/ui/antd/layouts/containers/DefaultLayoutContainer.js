import {connect} from 'react-redux';

import {uiChangeMenuCollapsed} from '../../../../state/ui/actions';
import DefaultLayout from '../components/DefaultLayout';

const mapStateToProps = (state, ownProps) => {
  return {
    isMenuCollapsed: state.ui.get('isMenuCollapsed')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uiChangeMenuCollapsed: () => {
      dispatch(uiChangeMenuCollapsed());
    }
  }
}

const DefaultLayoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);

export default DefaultLayoutContainer;
