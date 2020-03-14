import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from './reducers';
import apiSessionMiddleware from './middleware/apiSessionMiddleware';
import Logger from '../lib/Logger';

const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunkMiddleware, apiSessionMiddleware)
  )
);

export default store;

Logger.log('silly', `store.dev loaded.`);
