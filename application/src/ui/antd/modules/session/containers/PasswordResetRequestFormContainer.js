import {connect} from 'react-redux';
import {List} from 'immutable';

import {requestPasswordResetCode, passwordResetCodeFormDestroy} from '../../../../../state/actions';
import PasswordResetRequestForm from '../components/PasswordResetRequestForm';

const inputs = List([
  'email',
]);

const mapStateToProps = (state, ownProps) => {

  const data = {}, errors = {};
  for (const val of inputs.values()) {
    data[val] = '';
    if (state.session.getIn(['passwordResetCodeForm', 'errors', val])) {
      errors[val] = state.session.getIn(['passwordResetCodeForm', 'errors', val]);
    }
  }

  return {
    isSubmitting: state.session.get('isPasswordResetCodeSubmitting'),
    success: state.session.getIn(['passwordResetCodeForm', 'success']),
    data: data,
    errors: errors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: (data, cb) => {
      dispatch(requestPasswordResetCode(data, cb));
    },
    formDestroy: (formState) => {
      dispatch(passwordResetCodeFormDestroy(formState));
    }
  }
}

const PasswordResetRequestFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetRequestForm);

export default PasswordResetRequestFormContainer;
