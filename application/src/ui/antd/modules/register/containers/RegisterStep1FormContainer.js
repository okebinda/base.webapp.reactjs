import {connect} from 'react-redux';
import {List} from 'immutable';

import {
  registerStep1,
  registerStep1FormDestroy,
  loadTermsOfServiceCurrent
} from '../../../../../state/modules/register/actions';
import {createSession} from '../../../../../state/actions';
import RegisterStep1Form from '../components/RegisterStep1Form';

const inputs = List([
  'username',
  'password',
  'password2',
  'email',
  'tos_id'
]);

const mapStateToProps = (state) => {

  const data = {}, errors = {};
  for (const val of inputs.values()) {
    data[val] = '';
    if (state.register.getIn(['step1Form', 'errors', val])) {
      errors[val] = state.register.getIn(['step1Form', 'errors', val]);
    }
  }

  let currentTosId = '';
  if (state.entities.get('tos')) {
    currentTosId = state.entities.get('tos')[Object.keys(state.entities.get('tos'))[0]].id;
  }
  
  return {
    isSubmitting: state.register.get('isStep1Submitting') || state.session.get('isSubmitting'),
    success: state.register.getIn(['step1Form', 'success']),
    data: data,
    errors: errors,
    tos_id: currentTosId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: (data, cb) => {
      dispatch(registerStep1(data, cb));
    },
    formDestroy: (formState) => {
      dispatch(registerStep1FormDestroy(formState));
    },
    loadTermsOfServiceCurrent: () => {
      dispatch(loadTermsOfServiceCurrent());
    },
    createSession: (data, cb) => {
      dispatch(createSession(data, cb));
    }
  }
}

const RegisterStep1FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterStep1Form);

export default RegisterStep1FormContainer;
