import {connect} from 'react-redux';

import {loadTermsOfServiceCurrent} from '../../../../../state/modules/register/actions';
import TermsOfServiceModal from '../components/TermsOfServiceModal';

const mapStateToProps = (state) => {

  let currentTosId = null, currentTosText = null, currentTosVersion = null, currentTosPublishDate = null;
  if (state.entities.get('tos')) {
    const currentTos = state.entities.get('tos')[Object.keys(state.entities.get('tos'))[0]];
    if (currentTos) {
      currentTosId = currentTos.id;
      currentTosText = currentTos.text;
      currentTosVersion = currentTos.version;
      currentTosPublishDate = currentTos.publish_date;
    }
  }
  
  return {
    isLoading: state.register.get('isTermsOfServiceLoading'),
    id: currentTosId,
    text: currentTosText,
    version: currentTosVersion,
    publishDate: currentTosPublishDate,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTermsOfServiceCurrent: () => {
      dispatch(loadTermsOfServiceCurrent());
    }
  }
}

const TermsOfServiceModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsOfServiceModal);

export default TermsOfServiceModalContainer;
