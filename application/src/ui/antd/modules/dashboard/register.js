import React from 'react';
import i18next from 'i18next';

import Config from '../../../../Config';
import Logger from '../../../../lib/Logger';
import Events from '../../../../lib/EventEmitter';

const DashboardScreen = React.lazy(() => import('./components/DashboardScreen'));

const register = () => {
  Logger.log('debug', `dashboard.register()`);

  if (Config.getIn(['MODULE_TOGGLES', 'dashboard', 'routes'])) {
    Events.dispatch('ADD_MAIN_ROUTES', 

      // screen name (key): [route type (element), path (prop), exact (prop), component (prop)]
      {
        'DashboardScreen': ['PrivateRoute', "/dashboard", true, DashboardScreen, i18next.t('route_dashboard')]
      }
    );
  }
}

export default register;

Logger.log('silly', `dashboard.register() loaded.`);
