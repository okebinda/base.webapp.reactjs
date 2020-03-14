import {Map} from 'immutable';

import {
  REGISTER_STEP1_REQUEST,
  REGISTER_STEP1_SUCCESS,
  REGISTER_STEP1_FAILURE,
  REGISTER_STEP1_FORM_DESTROY,
  REGISTER_STEP2_REQUEST,
  REGISTER_STEP2_SUCCESS,
  REGISTER_STEP2_FAILURE,
  REGISTER_STEP2_FORM_DESTROY,
  TERMS_OF_SERVICE_CURRENT_REQUEST,
  TERMS_OF_SERVICE_CURRENT_SUCCESS,
  TERMS_OF_SERVICE_CURRENT_FAILURE
} from './actions';
import {SESSION_DESTROY} from '../../actions';
import Logger from '../../../lib/Logger';

const initialState = Map({
  isStep1Submitting: false,
  isStep2Submitting: false,
  isTermsOfServiceLoading: false,
  step1Form: null,
  step2Form: null
});

export default function register(
  state=initialState,
  action
) {
  Logger.log('debug', `[state.register.reducers] register(###, ###)`, state, action);

  switch(action.type) {

    case REGISTER_STEP1_REQUEST:
      return state.mergeDeep({
        isStep1Submitting: true,
        step1Form: null
      });

    case REGISTER_STEP1_SUCCESS:
      return state.mergeDeep({
        isStep1Submitting: false,
        step1Form: {
          success: true,
          errors: null
        },
        lastUpdated: action.receivedAt
      });

    case REGISTER_STEP1_FAILURE:
      return state.mergeDeep({
        isStep1Submitting: false,
        step1Form: {
          success: false,
          errors: null
        }
      }).setIn(['step1Form', 'errors'], action.error);

    case REGISTER_STEP1_FORM_DESTROY:
      return state.mergeDeep({
        step1Form: null
      }).set('step1Form', action.step1Form);

    case REGISTER_STEP2_REQUEST:
      return state.mergeDeep({
        isStep2Submitting: true,
        step2Form: null
      });

    case REGISTER_STEP2_SUCCESS:
      return state.mergeDeep({
        isStep2Submitting: false,
        step2Form: {
          success: true,
          errors: null
        },
        lastUpdated: action.receivedAt
      });

    case REGISTER_STEP2_FAILURE:
      return state.mergeDeep({
        isStep2Submitting: false,
        step2Form: {
          success: false,
          errors: null
        }
      }).setIn(['step2Form', 'errors'], action.error);

    case REGISTER_STEP2_FORM_DESTROY:
      return state.mergeDeep({
        step2Form: null
      }).set('step2Form', action.step2Form);

    case TERMS_OF_SERVICE_CURRENT_REQUEST:
      return state.mergeDeep({
        isTermsOfServiceLoading: true
      });

    case TERMS_OF_SERVICE_CURRENT_SUCCESS:
      return state.mergeDeep({
        isTermsOfServiceLoading: false,
        lastUpdated: action.receivedAt
      });

    case TERMS_OF_SERVICE_CURRENT_FAILURE:
      return state.mergeDeep({
        isTermsOfServiceLoading: false
      });

    case SESSION_DESTROY:
      return initialState;

    default:
      return state;
  }
}

Logger.log('silly', `state.register.reducers loaded.`);
