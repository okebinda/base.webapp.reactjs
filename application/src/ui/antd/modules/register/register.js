import React from 'react';
import i18next from 'i18next';

import Config from '../../../../Config';
import Logger from '../../../../lib/Logger';
import Events from '../../../../lib/EventEmitter';

const RegisterStep1Screen = React.lazy(() => import('./components/RegisterStep1Screen'));
const RegisterStep2Screen = React.lazy(() => import('./components/RegisterStep2Screen'));

const register = () => {
  Logger.log('debug', `register.register()`);

  if (Config.getIn(['MODULE_TOGGLES', 'register', 'routes'])) {
    Events.dispatch('ADD_DEFAULT_ROUTES', 

      // screen name (key): [route type (element), path (prop), exact (prop), component (prop)]
      {
        'RegisterStep1Screen': ['Route', "/register", true, RegisterStep1Screen, i18next.t('route_register_step1')],
        'RegisterStep2Screen': ['PrivateRoute', "/register/step2", true, RegisterStep2Screen, i18next.t('route_register_step2')]
      }
    );
  }
}

export default register;

Logger.log('silly', `register.register() loaded.`);
