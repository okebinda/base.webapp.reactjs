import api from '../../api';
import Logger from '../../../lib/Logger';
import {addEntities} from '../../actions';

export const REGISTER_STEP1_REQUEST = 'REGISTER_STEP1_REQUEST';
export const REGISTER_STEP1_SUCCESS = 'REGISTER_STEP1_SUCCESS';
export const REGISTER_STEP1_FAILURE = 'REGISTER_STEP1_FAILURE';
export const REGISTER_STEP1_FORM_DESTROY = 'REGISTER_STEP1_FORM_DESTROY';
export const REGISTER_STEP2_REQUEST = 'REGISTER_STEP2_REQUEST';
export const REGISTER_STEP2_SUCCESS = 'REGISTER_STEP2_SUCCESS';
export const REGISTER_STEP2_FAILURE = 'REGISTER_STEP2_FAILURE';
export const REGISTER_STEP2_FORM_DESTROY = 'REGISTER_STEP2_FORM_DESTROY';
export const TERMS_OF_SERVICE_CURRENT_REQUEST = 'TERMS_OF_SERVICE_CURRENT_REQUEST';
export const TERMS_OF_SERVICE_CURRENT_SUCCESS = 'TERMS_OF_SERVICE_CURRENT_SUCCESS';
export const TERMS_OF_SERVICE_CURRENT_FAILURE = 'TERMS_OF_SERVICE_CURRENT_FAILURE';

export function registerStep1Request(data) {
  Logger.log('debug', `[state.register.actions] registerStep1Request(###)`, data);
  return {
    type: REGISTER_STEP1_REQUEST,
    username: data.username,
    email: data.email,
    password: data.password,
    password2: data.password2,
    tos_id: data.tos_id,
  }
}

export function registerStep1Success(data) {
  Logger.log('debug', `[state.register.actions] registerStep1Success(###)`, data);
  return {
    type: REGISTER_STEP1_SUCCESS,
    username: data.username,
    email: data.email,
    password_changed_at: data.password_changed_at,
    is_verified: data.is_verified,
    first_name: data.first_name,
    last_name: data.last_name,
    joined_at: data.joined_at,
    receivedAt: Date.now()
  }
}

export function registerStep1Failure(error) {
  Logger.log('debug', `[state.register.actions] registerStep1Failure(###)`, error);
  return {
    type: REGISTER_STEP1_FAILURE,
    error: error
  }
}

export function registerStep1FormDestroy(formState=null) {
  Logger.log('debug', `[state.register.actions] registerStep1FormDestroy(###)`, formState);
  return {
    type: REGISTER_STEP1_FORM_DESTROY,
    form: formState
  }
}

export function registerStep2Request(data) {
  Logger.log('debug', `[state.register.actions] registerStep2Request(###)`, data);
  return {
    type: REGISTER_STEP2_REQUEST,
    first_name: data.first_name,
    last_name: data.last_name
  }
}

export function registerStep2Success(data) {
  Logger.log('debug', `[state.register.actions] registerStep2Success(###)`, data);
  return {
    type: REGISTER_STEP2_SUCCESS,
    username: data.username,
    email: data.email,
    password_changed_at: data.password_changed_at,
    is_verified: data.is_verified,
    first_name: data.first_name,
    last_name: data.last_name,
    joined_at: data.joined_at,
    receivedAt: Date.now()
  }
}

export function registerStep2Failure(error) {
  Logger.log('debug', `[state.register.actions] registerStep2Failure(###)`, error);
  return {
    type: REGISTER_STEP2_FAILURE,
    error: error
  }
}

export function registerStep2FormDestroy(formState=null) {
  Logger.log('debug', `[state.register.actions] registerStep2FormDestroy(###)`, formState);
  return {
    type: REGISTER_STEP2_FORM_DESTROY,
    form: formState
  }
}

export function termsOfServiceCurrentRequest(page, limit) {
  Logger.log('debug', `[state.register.actions] termsOfServiceCurrentRequest(${page}, ${limit})`);
  return {
    type: TERMS_OF_SERVICE_CURRENT_REQUEST
  }
}

export function termsOfServiceCurrentSuccess(data) {
  Logger.log('debug', `[state.register.actions] termsOfServiceCurrentSuccess(###)`, data);
  return {
    type: TERMS_OF_SERVICE_CURRENT_SUCCESS,
    id: data.id,
    text: data.text,
    version: data.version,
    publish_date: data.publish_date,
    receivedAt: Date.now()
  }
}

export function termsOfServiceCurrentFailure(error) {
  Logger.log('debug', `[state.register.actions] termsOfServiceCurrentFailure(###)`, error);
  return {
    type: TERMS_OF_SERVICE_CURRENT_FAILURE,
    error: error
  }
}

// API THUNK ACTION CREATORS

export function registerStep1(data, cb=function(){}) {
  Logger.log('debug', `[state.register.actions] registerStep1(###, ###)`);

  return async function(dispatch) {
    dispatch(registerStep1Request(data));

    // call API
    const response = await api.postUserAccountStep1(data);

    // post register step 1 success
    if (201 === response.get('status')) {

      Logger.log('info', `POST API register step 1 success.`);

      const registerSuccessData = {
        username: response.getIn(['data', 'user_account', 'username']),
        email: response.getIn(['data', 'user_account', 'email']),
        first_name: response.getIn(['data', 'user_account', 'first_name']),
        last_name: response.getIn(['data', 'user_account', 'last_name']),
        password_changed_at: response.getIn(['data', 'user_account', 'password_changed_at']),
        is_verified: response.getIn(['data', 'user_account', 'is_verified']),
        joined_at: response.getIn(['data', 'user_account', 'joined_at'])
      };

      dispatch(registerStep1Success(registerSuccessData));

    // get register step 1 failure
    } else {
      Logger.log('info', `POST API register step 1 failure.`);
      dispatch(registerStep1Failure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb();
  }
}

export function registerStep2(data, cb=function(){}) {
  Logger.log('debug', `[state.register.actions] registerStep2(###, ###)`);

  return async function(dispatch) {
    dispatch(registerStep2Request(data));

    // call API
    const response = await api.postUserAccountStep2(data);

    // post register step 2 success
    if (201 === response.get('status')) {

      Logger.log('info', `POST API register step 2 success.`);

      const registerSuccessData = {
        username: response.getIn(['data', 'user_account', 'username']),
        email: response.getIn(['data', 'user_account', 'email']),
        first_name: response.getIn(['data', 'user_account', 'first_name']),
        last_name: response.getIn(['data', 'user_account', 'last_name']),
        password_changed_at: response.getIn(['data', 'user_account', 'password_changed_at']),
        is_verified: response.getIn(['data', 'user_account', 'is_verified']),
        joined_at: response.getIn(['data', 'user_account', 'joined_at'])
      };

      dispatch(registerStep2Success(registerSuccessData));
      
    // get register step 2 failure
    } else {
      Logger.log('info', `POST API register step 2 failure.`);
      dispatch(registerStep2Failure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb();
  }
}

export function loadTermsOfServiceCurrent(cb=function(){}) {
  Logger.log('debug', `[state.register.actions] loadTermsOfServiceCurrent(###)`);

  return async function(dispatch) {
    dispatch(termsOfServiceCurrentRequest());

    // call API
    const response = await api.getTermsOfServiceCurrent();

    // get ToS list success
    if (200 === response.get('status')) {

      Logger.log('info', `GET API current terms of service success.`);

      const tosSuccessData = {
        id: response.getIn(['data', 'terms_of_service', 'id']),
        text: response.getIn(['data', 'terms_of_service', 'text']),
        version: response.getIn(['data', 'terms_of_service', 'version']),
        publish_date: response.getIn(['data', 'terms_of_service', 'publish_date'])
      };

      // normalize data for single instance
      const tosId = response.getIn(['data', 'terms_of_service', 'id']);
      const normalizedToS = {
        entities: {
          tos: {
            [tosId]: tosSuccessData
          }
        }
      };

      dispatch(addEntities(normalizedToS));
      dispatch(termsOfServiceCurrentSuccess(tosSuccessData));
      
    // get ToS list failure
    } else {
      Logger.log('info', `GET API current terms of service failure.`);
      dispatch(termsOfServiceCurrentFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb();
  }
}

Logger.log('silly', `state.register.actions loaded.`);
