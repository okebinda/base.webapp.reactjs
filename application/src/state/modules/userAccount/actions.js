import api from '../../api';
import Logger from '../../../lib/Logger';

export const USER_ACCOUNT_READ_REQUEST = 'USER_ACCOUNT_READ_REQUEST';
export const USER_ACCOUNT_READ_SUCCESS = 'USER_ACCOUNT_READ_SUCCESS';
export const USER_ACCOUNT_READ_FAILURE = 'USER_ACCOUNT_READ_FAILURE';
export const USER_ACCOUNT_UPDATE_REQUEST = 'USER_ACCOUNT_UPDATE_REQUEST';
export const USER_ACCOUNT_UPDATE_SUCCESS = 'USER_ACCOUNT_UPDATE_SUCCESS';
export const USER_ACCOUNT_UPDATE_FAILURE = 'USER_ACCOUNT_UPDATE_FAILURE';
export const USER_ACCOUNT_FORM_DESTROY = 'USER_ACCOUNT_FORM_DESTROY';
export const PASSWORD_UPDATE_REQUEST = 'PASSWORD_UPDATE_REQUEST';
export const PASSWORD_UPDATE_SUCCESS = 'PASSWORD_UPDATE_SUCCESS';
export const PASSWORD_UPDATE_FAILURE = 'PASSWORD_UPDATE_FAILURE';
export const PASSWORD_FORM_DESTROY = 'PASSWORD_FORM_DESTROY';


export function userAccountReadRequest() {
  Logger.log('debug', `[state.userAccount.actions] userAccountReadRequest()`);
  return {
    type: USER_ACCOUNT_READ_REQUEST
  }
}

export function userAccountReadSuccess(data) {
  Logger.log('debug', `[state.userAccount.actions] userAccountReadSuccess(###)`, data);
  return {
    type: USER_ACCOUNT_READ_SUCCESS,
    id: data.id,
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

export function userAccountReadFailure(error) {
  Logger.log('debug', `[state.userAccount.actions] userAccountReadFailure(###)`, error);
  return {
    type: USER_ACCOUNT_READ_FAILURE,
    error: error
  }
}

export function userAccountUpdateRequest(data) {
  Logger.log('debug', `[state.userAccount.actions] userAccountUpdateRequest(###)`, data);
  return {
    type: USER_ACCOUNT_UPDATE_REQUEST,
    username: data.username,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
  }
}

export function userAccountUpdateSuccess(data) {
  Logger.log('debug', `[state.userAccount.actions] userAccountUpdateSuccess(###)`, data);
  return {
    type: USER_ACCOUNT_UPDATE_SUCCESS,
    id: data.id,
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

export function userAccountUpdateFailure(error) {
  Logger.log('debug', `[state.userAccount.actions] userAccountUpdateFailure(###)`, error);
  return {
    type: USER_ACCOUNT_UPDATE_FAILURE,
    error: error
  }
}

export function userAccountFormDestroy(formState=null) {
  Logger.log('debug', `[state.userAccount.actions] userAccountFormDestroy(###)`, formState);
  return {
    type: USER_ACCOUNT_FORM_DESTROY,
    form: formState
  }
}

export function passwordUpdateRequest() {
  Logger.log('debug', `[state.userAccount.actions] passwordUpdateRequest()`);
  return {
    type: PASSWORD_UPDATE_REQUEST
  }
}

export function passwordUpdateSuccess() {
  Logger.log('debug', `[state.userAccount.actions] passwordUpdateSuccess()`);
  return {
    type: PASSWORD_UPDATE_SUCCESS
  }
}

export function passwordUpdateFailure(error) {
  Logger.log('debug', `[state.userAccount.actions] passwordUpdateFailure(%j)`, error);
  return {
    type: PASSWORD_UPDATE_FAILURE,
    error: error
  }
}

export function passwordFormDestroy(formState=null) {
  Logger.log('debug', `[state.userAccount.actions] passwordFormDestroy(%j)`, formState);
  return {
    type: PASSWORD_FORM_DESTROY,
    form: formState
  }
}


// API THUNK ACTION CREATORS

export function loadUserAccount(cb=function(){}) {
  Logger.log('debug', `[state.userAccount.actions] loadUserAccount(###)`);

  return async function(dispatch) {
    dispatch(userAccountReadRequest());

    // call API
    const response = await api.getUserAccount();
    let success = false;

    // get user account success
    if (200 === response.get('status')) {

      Logger.log('info', `GET API user account success.`);

      success = true;
      const data = {
        id: response.getIn(['data', 'user_account', 'id']),
        username: response.getIn(['data', 'user_account', 'username']),
        email: response.getIn(['data', 'user_account', 'email']),
        first_name: response.getIn(['data', 'user_account', 'first_name']),
        last_name: response.getIn(['data', 'user_account', 'last_name']),
        password_changed_at: response.getIn(['data', 'user_account', 'password_changed_at']),
        is_verified: response.getIn(['data', 'user_account', 'is_verified']),
        joined_at: response.getIn(['data', 'user_account', 'joined_at'])
      };

      dispatch(userAccountReadSuccess(data));
      
    // get user account failure
    } else {
      Logger.log('info', `GET API user account failure.`);
      dispatch(userAccountReadFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb(success);
  }
}

export function updateUserAccount(data, cb=function(){}) {
  Logger.log('debug', `[state.userAccount.actions] updateUserAccount(%j, ###)`, data);

  return async function(dispatch) {
    dispatch(userAccountUpdateRequest(data));

    // call API
    const response = await api.putUserAccount(data);

    // put user account success
    if (200 === response.get('status')) {

      Logger.log('info', `PUT API user account success.`);

      const data = {
        id: response.getIn(['data', 'user_account', 'id']),
        username: response.getIn(['data', 'user_account', 'username']),
        email: response.getIn(['data', 'user_account', 'email']),
        first_name: response.getIn(['data', 'user_account', 'first_name']),
        last_name: response.getIn(['data', 'user_account', 'last_name']),
        password_changed_at: response.getIn(['data', 'user_account', 'password_changed_at']),
        is_verified: response.getIn(['data', 'user_account', 'is_verified']),
        joined_at: response.getIn(['data', 'user_account', 'joined_at'])
      };

      dispatch(userAccountUpdateSuccess(data));
      
    // get user account failure
    } else {
      Logger.log('info', `PUT API user account failure.`);
      dispatch(userAccountUpdateFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb();
  }
}

export function updatePassword(data, cb=function(){}) {
  Logger.log('debug', `[state.userAccount.actions] updatePassword(###, ###)`);

  return async function(dispatch) {
    dispatch(passwordUpdateRequest());

    // call API
    const response = await api.putUserAccountPassword(data);

    // put password success
    if (200 === response.get('status')) {
      Logger.log('info', `PUT API password success.`);
      dispatch(passwordUpdateSuccess());
      
    // put password failure
    } else {
      Logger.log('info', `PUT API password failure.`);
      dispatch(passwordUpdateFailure(response.getIn(['data', 'error'])));
    }

    // callback function
    cb();
  }
}

Logger.log('silly', `state.userAccount.actions loaded.`);
