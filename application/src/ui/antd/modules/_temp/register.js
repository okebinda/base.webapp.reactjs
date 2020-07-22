// import React from 'react';

import Config from '../../../../Config';
import Logger from '../../../../lib/Logger';
import Events from '../../../../lib/EventEmitter';

import Temp1Screen from './components/Temp1Screen';
import Temp2Screen from './components/Temp2Screen';
// const Temp1Screen = React.lazy(() => import('./components/Temp1Screen'));
// const Temp2Screen = React.lazy(() => import('./components/Temp2Screen'));

const register = () => {
  Logger.log('debug', `_temp.register()`);

  if (Config.getIn(['MODULE_TOGGLES', '_temp', 'routes'])) {
    Events.dispatch('ADD_MAIN_ROUTES', 

      // screen name (key): [route type (element), path (prop), exact (prop), component (prop)]
      {
        'Temp1Screen': ['PrivateRoute', "/temp/temp1", true, Temp1Screen, "Temp 1"],
        'Temp2Screen': ['PrivateRoute', "/temp/temp2", true, Temp2Screen, "Temp 2"]
      }
    );
  }
}

export default register;

Logger.log('silly', `_temp.register() loaded.`);
