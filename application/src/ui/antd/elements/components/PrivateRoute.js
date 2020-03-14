import React from 'react';
import {Route, Redirect} from 'react-router-dom'

import {pathTo} from '../../Routes';
import Config from '../../../../Config';
import Logger from '../../../../lib/Logger';

const PrivateRoute = ({ isAuthenticated: isAuth, component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuth === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: pathTo(Config.get('DEFAULT_LOGIN_SCREEN')),
          state: { from: props.location }
        }} />
  )} />
);

export default PrivateRoute;

Logger.log('silly', `PrivateRoute loaded.`);
