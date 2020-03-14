import Logger from '../../lib/Logger';

export const UI_CHANGE_MENU_COLLAPSED = 'UI_CHANGE_MENU_COLLAPSED';

export function uiChangeMenuCollapsed() {
  Logger.log('debug', `[state.ui.actions] uiChangeMenuCollapsed()`);
  return {
    type: UI_CHANGE_MENU_COLLAPSED
  }
}

Logger.log('silly', `state.ui.actions loaded.`);
