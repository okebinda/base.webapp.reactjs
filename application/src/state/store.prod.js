import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from './reducers';
import apiSessionMiddleware from './middleware/apiSessionMiddleware';
import Logger from '../lib/Logger';

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, apiSessionMiddleware)
);

export default store;

Logger.log('silly', `store.prod loaded.`);
