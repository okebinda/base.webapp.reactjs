import {connect} from 'react-redux';
import {List} from 'immutable';

import {updatePassword, passwordFormDestroy} from '../../../../../state/modules/userAccount/actions';
import {sendMessage} from '../../../../../state/actions';
import UpdatePasswordForm from '../components/UpdatePasswordForm';

const inputs = List([
  'previous_password',
  'password1',
  'password2'
]);

const mapStateToProps = (state) => {

  const data = {}, errors = {};
  for (const val of inputs.values()) {
    data[val] = '';
    if (state.userAccount.getIn(['passwordForm', 'errors', val])) {
      errors[val] = state.userAccount.getIn(['passwordForm', 'errors', val]);
    }
  }
  
  return {
    isSubmitting: state.userAccount.get('isPasswordSubmitting'),
    success: state.userAccount.getIn(['passwordForm', 'success']),
    data: data,
    errors: errors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: (data, cb) => {
      dispatch(updatePassword(data, cb));
    },
    formDestroy: (formState) => {
      dispatch(passwordFormDestroy(formState));
    },
    sendMessage: (level, title, body, expires) => {
      dispatch(sendMessage(level, title, body, expires));
    }
  }
}

const UpdatePasswordFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePasswordForm);

export default UpdatePasswordFormContainer;
