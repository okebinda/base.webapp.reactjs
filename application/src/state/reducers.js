import {combineReducers} from 'redux';
import {Map, OrderedMap} from 'immutable';

import {
  ADD_ENTITIES,
  REMOVE_ENTITY,
  SEND_MESSAGE,
  REMOVE_MESSAGE,
  SESSION_CREATE_REQUEST,
  SESSION_CREATE_SUCCESS,
  SESSION_CREATE_FAILURE,
  SESSION_FORM_DESTROY,
  SESSION_HYDRATE,
  SESSION_DESTROY,
  PASSWORD_RESET_CODE_REQUEST,
  PASSWORD_RESET_CODE_SUCCESS,
  PASSWORD_RESET_CODE_FAILURE,
  PASSWORD_RESET_CODE_FORM_DESTROY,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILURE,
  PASSWORD_RESET_FORM_DESTROY
} from './actions';
import ui from './ui/reducers';
import Config from '../Config';
import Logger from '../lib/Logger';
import Auth from '../lib/Auth';

const initialEntitiesState = Map({});

export function entities(
  state=initialEntitiesState,
  action
) {
  Logger.log('debug', `[state.reducers] entities(###, ###)`, state, action);

  switch(action.type) {

    case ADD_ENTITIES:
      const tempState = {};
      for (var key in action.payload.entities) {
        tempState[key] = {...state.get(key, {}), ...action.payload.entities[key]};
      }
      return state.merge(tempState);

    case REMOVE_ENTITY:
      return state.deleteIn([action.payload.entityType, action.payload.id]);
    
    case SESSION_DESTROY:
      return initialEntitiesState;

    default:
      return state;
  }
}

export function messages(
  state=OrderedMap({}),
  action
) {
  Logger.log('debug', `[reducers] messages(%j, %j)`, state, action);

  switch(action.type) {

    case SEND_MESSAGE:
      const nextKey = state.isEmpty() ? 0 : parseInt(state.keySeq().last()) + 1;
      return state.set(
        nextKey,
        {
          level: action.level,
          title: action.title,
          body: action.body,
          expires: action.expires
        }
      );
    
    case REMOVE_MESSAGE:
        return state.delete(action.key);

    default:
      return state;
  }
}

const initialSessionStateNoAuth = Map({
  isSubmitting: false,
  isPasswordResetCodeSubmitting: false,
  isPasswordResetSubmitting: false,
  form: null,
  passwordResetCodeForm: null,
  passwordResetForm: null
});

const initialSessionState = initialSessionStateNoAuth.mergeDeep({
  ...Auth.getSession()
});

export function session(
  state=initialSessionState,
  action
) {
  Logger.log('debug', `[state.reducers] session(###, ###)`, state, action);

  switch(action.type) {

    case SESSION_CREATE_REQUEST:
      return state.mergeDeep({
        isSubmitting: true,
        form: null
      });

    case SESSION_CREATE_SUCCESS:
      return state.mergeDeep({
        isSubmitting: false,
        form: {
          success: true
        },
        authToken: action.authToken,
        authExpiration: action.authExpiration,
        authExpires: action.authExpires,
        userId: action.userId,
        username: action.username,
        lastUpdated: action.receivedAt
      });

    case SESSION_CREATE_FAILURE:
      return state.mergeDeep({
        isSubmitting: false,
        form: {
          success: false
        }
      }).setIn(['form', 'errors'], action.error);

    case SESSION_FORM_DESTROY:
        return state.mergeDeep({
          form: null
        }).set('form', action.form);

    case SESSION_HYDRATE:
      return state.mergeDeep({
        authToken: action.authToken,
        authExpiration: action.authExpiration,
        authExpires: action.authExpires,
        userId: action.userId,
        username: action.username
      });
    
    case SESSION_DESTROY:
      return initialSessionStateNoAuth;
    
    case PASSWORD_RESET_CODE_REQUEST:
      return state.mergeDeep({
        isPasswordResetCodeSubmitting: true,
        passwordResetCodeForm: null
      });

    case PASSWORD_RESET_CODE_SUCCESS:
      return state.mergeDeep({
        isPasswordResetCodeSubmitting: false,
        passwordResetCodeForm: {
          success: true
        },
        success: action.success,
        sent: action.sent,
        lastUpdated: action.receivedAt
      });

    case PASSWORD_RESET_CODE_FAILURE:
      return state.mergeDeep({
        isPasswordResetCodeSubmitting: false,
        passwordResetCodeForm: {
          success: false
        }
      }).setIn(['passwordResetCodeForm', 'errors'], action.error);

    case PASSWORD_RESET_CODE_FORM_DESTROY:
      return state.mergeDeep({
        passwordResetCodeForm: null
      }).set('passwordResetCodeForm', action.form);

    case PASSWORD_RESET_REQUEST:
      return state.mergeDeep({
        isPasswordResetSubmitting: true,
        passwordResetForm: null
      });

    case PASSWORD_RESET_SUCCESS:
      return state.mergeDeep({
        isPasswordResetSubmitting: false,
        passwordResetForm: {
          success: true
        },
        success: action.success,
        lastUpdated: action.receivedAt
      });

    case PASSWORD_RESET_FAILURE:
      return state.mergeDeep({
        isPasswordResetSubmitting: false,
        passwordResetForm: {
          success: false
        }
      }).setIn(['passwordResetForm', 'errors'], action.error);

    case PASSWORD_RESET_FORM_DESTROY:
      return state.mergeDeep({
        passwordResetForm: null
      }).set('passwordResetForm', action.form);

    default:
      return state;
  }
}

// register modules
const moduleReducers = {};
Config.get('MODULE_TOGGLES').keySeq().forEach(k => {
  if (Config.getIn(['MODULE_TOGGLES', k, 'enabled'])) {
    try {
      moduleReducers[k] = require(`./modules/${k}/reducers.js`).default;
    } catch(ex) {}
  }
});

const rootReducer = combineReducers({
  session,
  entities,
  messages,
  ui,
  ...moduleReducers
});

export default rootReducer;

Logger.log('silly', `state.reducers loaded.`);
