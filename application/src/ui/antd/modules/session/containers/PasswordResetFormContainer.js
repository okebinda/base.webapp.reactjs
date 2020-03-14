import {connect} from 'react-redux';
import {List} from 'immutable';

import {resetPassword, passwordResetFormDestroy} from '../../../../../state/actions';
import PasswordResetForm from '../components/PasswordResetForm';

const inputs = List([
  'email',
  'code',
  'password1',
  'password2',
]);

const mapStateToProps = (state, ownProps) => {

  const data = {}, errors = {};
  for (const val of inputs.values()) {
    data[val] = '';
    if (state.session.getIn(['passwordResetForm', 'errors', val])) {
      errors[val] = state.session.getIn(['passwordResetForm', 'errors', val]);
    }
  }

  return {
    isSubmitting: state.session.get('isPasswordResetSubmitting'),
    success: state.session.getIn(['passwordResetForm', 'success']),
    data: data,
    errors: errors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: (data, cb) => {
      dispatch(resetPassword(data, cb));
    },
    formDestroy: (formState) => {
      dispatch(passwordResetFormDestroy(formState));
    }
  }
}

const PasswordResetFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetForm);

export default PasswordResetFormContainer;
