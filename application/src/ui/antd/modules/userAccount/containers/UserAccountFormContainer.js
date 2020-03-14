import {connect} from 'react-redux';
import {List} from 'immutable';

import {
  loadUserAccount,
  updateUserAccount,
  userAccountFormDestroy
} from '../../../../../state/modules/userAccount/actions';
import {sendMessage} from '../../../../../state/actions';
import UserAccountForm from '../components/UserAccountForm';

const inputs = List([
  'username',
  'email',
  'first_name',
  'last_name'
]);

const mapStateToProps = (state) => {

  const data = {}, errors = {};
  for (const val of inputs.values()) {
    data[val] = state.userAccount.getIn(['data', val], '');
    if (state.userAccount.getIn(['form', 'errors', val])) {
      errors[val] = state.userAccount.getIn(['form', 'errors', val]);
    }
  }
  
  return {
    isLoading: state.userAccount.get('isLoading'),
    isSubmitting: state.userAccount.get('isSubmitting'),
    success: state.userAccount.getIn(['form', 'success']),
    data: data,
    errors: errors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    load: (cb) => {
      dispatch(loadUserAccount(cb));
    },
    submit: (data, cb) => {
      dispatch(updateUserAccount(data, cb));
    },
    formDestroy: (formState) => {
      dispatch(userAccountFormDestroy(formState));
    },
    sendMessage: (level, title, body, expires) => {
      dispatch(sendMessage(level, title, body, expires));
    }
  }
}

const UserAccountFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAccountForm);

export default UserAccountFormContainer
