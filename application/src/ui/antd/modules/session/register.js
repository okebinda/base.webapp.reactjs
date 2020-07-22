// import React from 'react';
import i18next from 'i18next';

import Config from '../../../../Config';
import Logger from '../../../../lib/Logger';
import Events from '../../../../lib/EventEmitter';

import LoginScreen from './containers/LoginScreenContainer';
import PasswordResetRequestScreen from './components/PasswordResetRequestScreen';
import PasswordResetScreen from './components/PasswordResetScreen';
// const LoginScreen = React.lazy(() => import('./containers/LoginScreenContainer'));
// const PasswordResetRequestScreen = React.lazy(() => import('./components/PasswordResetRequestScreen'));
// const PasswordResetScreen = React.lazy(() => import('./components/PasswordResetScreen'));

const register = () => {
  Logger.log('debug', `session.register()`);

  if (Config.getIn(['MODULE_TOGGLES', 'session', 'routes'])) {
    Events.dispatch('ADD_DEFAULT_ROUTES', 

      // screen name (key): [route type (element), path (prop), exact (prop), component (prop)]
      {
        'LoginScreen': ['Route', "/login", false, LoginScreen, i18next.t('route_login')],
        'PasswordResetRequestScreen': ['Route', "/password-reset/request", true, PasswordResetRequestScreen, i18next.t('route_password_reset_request')],
        'PasswordResetScreen': ['Route', "/password-reset", true, PasswordResetScreen, i18next.t('route_password_reset')]
      }
    );
  }
}

export default register;

Logger.log('silly', `session.register() loaded.`);
