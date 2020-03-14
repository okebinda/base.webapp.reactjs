import api from '../api';
import {
  SESSION_CREATE_SUCCESS,
  SESSION_HYDRATE,
  sessionDestroy,
} from '../actions';


const destroySession = function(store, sessionDestroy) {
  return () => {
    store.dispatch(sessionDestroy());
  }
}

const apiSessionMiddleware = store => next => action => {
  if(action.type === SESSION_CREATE_SUCCESS || action.type === SESSION_HYDRATE) {
    api.setDestroySession(destroySession(store, sessionDestroy));
    api.setAuthToken(action.authToken);
    api.setAuthExpires(action.authExpires);
  }

  // continue processing this action
  return next(action);
}

export default apiSessionMiddleware;
