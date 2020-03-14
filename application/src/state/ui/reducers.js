import {Map} from 'immutable';

import {UI_CHANGE_MENU_COLLAPSED} from './actions';
import Logger from '../../lib/Logger';

export default function ui(
  state=Map({
    isMenuCollapsed: false
  }),
  action
) {
  Logger.log('debug', `[state.ui.reducers] ui(%j, %j)`, state, action);

  switch(action.type) {

    case UI_CHANGE_MENU_COLLAPSED:
      return state.mergeDeep({
        isMenuCollapsed: !state.get('isMenuCollapsed')
      });

    default:
      return state;
  }
}

Logger.log('silly', `state.ui.reducers loaded.`);
