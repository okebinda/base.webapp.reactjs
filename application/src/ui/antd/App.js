import React, {Component, Suspense} from 'react';
import {Provider} from 'react-redux'

import Config from '../../Config';
import store from '../../state/store';
import {DefaultRoutes} from './Routes';
import Logger from '../../lib/Logger';
import Loading from './elements/components/Loading';
import SessionTimeoutModal from './modules/session/containers/SessionTimeoutModalContainer';
import withSplashScreen from './elements/containers/withSplashScreenContainer';

import 'antd/dist/antd.less';
// import 'antd/dist/antd.dark.less'; // enable dark mode
import './App.less';

// register modules
Config.get('MODULE_TOGGLES').keySeq().forEach(k => {
  if (Config.getIn(['MODULE_TOGGLES', k, 'enabled'])) {
    try {
      let register = require(`./modules/${k}/register.js`).default;
      register();
    } catch(ex) {}
  }
});

class InnerApp extends Component {
  render() {
    return (
      <div id="App">
        <Suspense fallback={<Loading/>}>
          <DefaultRoutes />
          <SessionTimeoutModal />
        </Suspense>
      </div>
    );
  }
}

// performs Auth check and hydrates session
const InnerAppWrapper = withSplashScreen(InnerApp);

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <InnerAppWrapper />
      </Provider>
    );
  }
}

export default App;

Logger.log('silly', `App loaded.`);
