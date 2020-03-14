import {connect} from 'react-redux';
import {List} from 'immutable';

import {
  registerStep2,
  registerStep2FormDestroy
} from '../../../../../state/modules/register/actions';
import RegisterStep2Form from '../components/RegisterStep2Form';

const inputs = List([
  'first_name',
  'last_name'
]);

const mapStateToProps = (state) => {

  const data = {}, errors = {};
  for (const val of inputs.values()) {
    data[val] = '';
    if (state.register.getIn(['step2Form', 'errors', val])) {
      errors[val] = state.register.getIn(['step2Form', 'errors', val]);
    }
  }
  
  return {
    isSubmitting: state.register.get('isStep2Submitting'),
    success: state.register.getIn(['step2Form', 'success']),
    data: data,
    errors: errors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: (data, cb) => {
      dispatch(registerStep2(data, cb));
    },
    formDestroy: (formState) => {
      dispatch(registerStep2FormDestroy(formState));
    }
  }
}

const RegisterStep2FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterStep2Form);

export default RegisterStep2FormContainer;
