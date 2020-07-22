import api from './api';
import Auth from '../lib/Auth';
import Logger from '../lib/Logger';
import Events from '../lib/EventEmitter';
import Config from '../Config';

export const ADD_ENTITIES = 'ADD_ENTITIES';
export const REMOVE_ENTITY = 'REMOVE_ENTITY';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const SESSION_CREATE_REQUEST = 'SESSION_CREATE_REQUEST';
export const SESSION_CREATE_SUCCESS = 'SESSION_CREATE_SUCCESS';
export const SESSION_CREATE_FAILURE = 'SESSION_CREATE_FAILURE';
export const SESSION_FORM_DESTROY = 'SESSION_FORM_DESTROY';
export const SESSION_HYDRATE = 'SESSION_HYDRATE';
export const SESSION_DESTROY = 'SESSION_DESTROY';
export const PASSWORD_RESET_CODE_REQUEST = 'PASSWORD_RESET_CODE_REQUEST';
export const PASSWORD_RESET_CODE_SUCCESS = 'PASSWORD_RESET_CODE_SUCCESS';
export const PASSWORD_RESET_CODE_FAILURE = 'PASSWORD_RESET_CODE_FAILURE';
export const PASSWORD_RESET_CODE_FORM_DESTROY = 'PASSWORD_RESET_CODE_FORM_DESTROY';
export const PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE';
export const PASSWORD_RESET_FORM_DESTROY = 'PASSWORD_RESET_FORM_DESTROY';


export const addEntities = (entities) => {
  Logger.log('debug', `[state.actions] addEntities(###)`, entities);
  return {
    type: ADD_ENTITIES,
    payload: entities
  }
};

export const removeEntity = (payload) => {
  Logger.log('debug', `[state.actions] removeEntity(###)`, payload);
  return {
    type: REMOVE_ENTITY,
    payload: payload
  }
};

export const sendMessage = (level, title, body, expires) => {
  Logger.log('debug', `[actions] sendMessage("${level}", "${title}", "${body}", ${expires})`);
  if (typeof expires === 'undefined') {
    expires = Config.get('DEFAULT_MESSAGE_TIMEOUT');
  }
  return {
    type: SEND_MESSAGE,
    level: level,
    title: title,
    body: body,
    expires: expires
  }
};

export const removeMessage = (key) => {
  Logger.log('debug', `[actions] removeMessage("${key}")`);
  return {
    type: REMOVE_MESSAGE,
    key: key
  }
};

export function sessionCreateRequest(data) {
  Logger.log('debug', `[state.actions] sessionCreateRequest(###)`);
  Events.dispatch('SESSION_CREATE_REQUEST');
  return {
    type: SESSION_CREATE_REQUEST,
    username: data.username,
    password: data.password,
  }
}

export function sessionCreateSuccess(data) {
  Logger.log('debug', `[state.actions] sessionCreateSuccess(###)`, data);
  Auth.setStorageType(data.remember ? 'local' : 'session');
  Auth.saveSession(data.authToken, data.authExpiration, data.authExpires, data.userId, data.username);
  Events.dispatch('SESSION_CREATE_SUCCESS');
  return {
    type: SESSION_CREATE_SUCCESS,
    authToken: data.authToken,
    authExpiration: data.authExpiration,
    authExpires: data.authExpires,
    userId: data.userId,
    username: data.username,
    receivedAt: Date.now()
  }
}

export function sessionCreateFailure(error) {
  Logger.log('debug', `[state.actions] sessionCreateFailure(${error})`);
  Events.dispatch('SESSION_CREATE_FAILURE');
  return {
    type: SESSION_CREATE_FAILURE,
    error: error
  }
}

export function sessionFormDestroy(formState=null) {
  Logger.log('debug', `[state.actions] sessionFormDestroy(###)`, formState);
  return {
    type: SESSION_FORM_DESTROY,
    form: formState
  }
}

export function sessionHydrate(data) {
  Logger.log('debug', `[state.actions] sessionHydrate()`);
  Events.dispatch('SESSION_HYDRATE');
  return {
    type: SESSION_HYDRATE,
    authToken: data.authToken,
    authExpiration: data.authExpiration,
    authExpires: data.authExpires,
    userId: data.userId,
    username: data.username
  }
}

export function sessionDestroy() {
  Logger.log('debug', `[state.actions] sessionDestroy()`);
  Auth.deleteSession();
  Events.dispatch('SESSION_DESTROY');
  return {
    type: SESSION_DESTROY
  }
}

export function passwordResetCodeRequest(data) {
  Logger.log('debug', `[state.actions] passwordResetCodeRequest(###)`);
  return {
    type: PASSWORD_RESET_CODE_REQUEST,
    email: data.email,
  }
}

export function passwordResetCodeSuccess(data) {
  Logger.log('debug', `[state.actions] passwordResetCodeSuccess(###)`, data);
  return {
    type: PASSWORD_RESET_CODE_SUCCESS,
    success: data.success,
    sent: data.sent,
    receivedAt: Date.now()
  }
}

export function passwordResetCodeFailure(error) {
  Logger.log('debug', `[state.actions] passwordResetCodeFailure(${error})`);
  return {
    type: PASSWORD_RESET_CODE_FAILURE,
    error: error
  }
}

export function passwordResetCodeFormDestroy(formState=null) {
  Logger.log('debug', `[state.actions] passwordResetCodeFormDestroy(###)`, formState);
  return {
    type: PASSWORD_RESET_CODE_FORM_DESTROY,
    form: formState
  }
}

export function passwordResetRequest(data) {
  Logger.log('debug', `[state.actions] passwordResetRequest(###)`);
  return {
    type: PASSWORD_RESET_REQUEST,
    email: data.email,
    code: data.code,
    password1: data.password1,
    password2: data.password2,
  }
}

export function passwordResetSuccess(data) {
  Logger.log('debug', `[state.actions] passwordResetSuccess(###)`, data);
  return {
    type: PASSWORD_RESET_SUCCESS,
    success: data.success,
    receivedAt: Date.now()
  }
}

export function passwordResetFailure(error) {
  Logger.log('debug', `[state.actions] passwordResetFailure(${error})`);
  return {
    type: PASSWORD_RESET_FAILURE,
    error: error
  }
}

export function passwordResetFormDestroy(formState=null) {
  Logger.log('debug', `[state.actions] passwordResetFormDestroy(###)`, formState);
  return {
    type: PASSWORD_RESET_FORM_DESTROY,
    form: formState
  }
}


// API THUNK ACTION CREATORS

export function createSession(data, cb=function(){}) {
  Logger.log('debug', `[state.actions] createSession(###, ###)`);

  return async function(dispatch) {
    
    dispatch(sessionCreateRequest(data));

    // call API
    const response = await api.getToken(data.username, data.password);
    let success = false;

    // get token success
    if (200 === response.get('status')) {

      Logger.log('info', `GET API token success. User: ${response.getIn(['data', 'user_id'])}`);
      success = true;

      const sessionSuccessData = {
        authToken: response.getIn(['data', 'token']),
        authExpiration: response.getIn(['data', 'expiration']),
        authExpires: Math.round(new Date().getTime()/1000) + parseInt(response.getIn(['data', 'expiration'])),
        userId: response.getIn(['data', 'user_id']),
        username: response.getIn(['data', 'username']),
        remember: data.remember
      };

      dispatch(sessionCreateSuccess(sessionSuccessData));
      
    // get token failure
    } else {
      Logger.log('info', `GET API token failure.`);
      dispatch(sessionCreateFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb(success);
  }
}

export function destroySession(cb=function(){}) {
  Logger.log('debug', `[actions] destroySession(###)`);
  return async function(dispatch) {
    dispatch(sessionDestroy());
    cb();
  }
}

export function requestPasswordResetCode(data, cb=function(){}) {
  Logger.log('debug', `[state.actions] requestPasswordResetCode(###, ###)`);

  return async function(dispatch) {
    
    dispatch(passwordResetCodeRequest(data));

    // call API
    const response = await api.postPasswordRequestResetCode(data);
    let success = false;

    // post password reset code success
    if (201 === response.get('status')) {

      Logger.log('info', `POST API password reset code success.`);

      success = true;
      const resetSuccessData = {
        success: response.getIn(['data', 'success']),
        sent: response.getIn(['data', 'sent'])
      };

      dispatch(passwordResetCodeSuccess(resetSuccessData));
      
    // post password reset code failure
    } else {
      Logger.log('info', `POST API password reset code failure.`);
      dispatch(passwordResetCodeFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb(success);
  }
}

export function resetPassword(data, cb=function(){}) {
  Logger.log('debug', `[state.actions] resetPassword(###, ###)`);

  return async function(dispatch) {
    
    dispatch(passwordResetRequest(data));

    // call API
    const response = await api.putPasswordReset(data);
    let success = false;

    // put password reset success
    if (200 === response.get('status')) {

      Logger.log('info', `PUT API password reset success.`);

      success = true;
      const resetSuccessData = {
        success: response.getIn(['data', 'success'])
      };

      dispatch(passwordResetSuccess(resetSuccessData));
      
    // put password reset failure
    } else {
      Logger.log('info', `PUT API password reset failure.`);
      dispatch(passwordResetFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb(success);
  }
}

Logger.log('silly', `state.actions loaded.`);
