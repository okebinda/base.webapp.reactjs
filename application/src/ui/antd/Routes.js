import React from 'react';
import {matchPath, Route, Switch} from 'react-router-dom';
import {generatePath} from "react-router";
import {Map} from 'immutable';
import {TransitionGroup, CSSTransition} from "react-transition-group";

import Logger from '../../lib/Logger';
import Events from '../../lib/EventEmitter';
import PrivateRoute from './elements/containers/PrivateRouteContainer';
import Config from '../../Config';
import {lang, defaultLang} from '../../lib/Localization';

// layouts
const DefaultLayout = React.lazy(() => import('./layouts/containers/DefaultLayoutContainer'));

// public screens
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));


// screen name (key): [route type (element), path (prop), exact (prop), component (prop), name]
let defaultRoutes = Map({

  // home screen exact match should use its own layout
  'HomeScreen': ['Route', "/", true, HomeScreen],
});

Events.subscribe('ADD_DEFAULT_ROUTES', (data) => {
  defaultRoutes = defaultRoutes.merge(data);
});


// routes that use the default layout
let mainRoutes = Map();

// merge all routes for generating paths
let routes = defaultRoutes.merge(mainRoutes);

Events.subscribe('ADD_MAIN_ROUTES', (data) => {
  mainRoutes = mainRoutes.merge(data);
  routes = defaultRoutes.merge(mainRoutes);
});

// if multiple languages are supported, use a language path prefix
const routePrefix = Config.get('LANGUAGES') ? `/:lang(${Config.get('LANGUAGES').join('|')})?` : '';
Logger.log('debug', `Routes routePrefix: ${routePrefix}`);

export {routes};

// test for existence of route
export function hasRoute(screen){
  Logger.log('debug', `hasRoute(${screen})`);
  if (routes.has(screen)) {
    return true;
  }
}

// generate path to screen
export function pathTo(screen, params=null) {
  Logger.log('debug', `pathTo(${screen}, %j)`, params);
  return defaultLang === lang
    ? generatePath(routes.get(screen)[1], params)
    : '/' + lang + generatePath(routes.get(screen)[1], params);
}

// math path to screen
export function getRouteFromPath(path) {
  let output = null;
  routes.entrySeq().forEach((rt) => {
    const screen = rt[0];
    const route = rt[1];
    const name = route[4];
    const matched = matchPath(
      path,
      {
        path: route[1],
        exact: route[2], 
        strict: false,
        sensitive: false
      }
    );
    if (matched && name) {
      output = {screen: screen, route: route};
    }
  });
  return output;
}

export function routesForBreadcrumb() {
  return mainRoutes.valueSeq().map((x, i) => { return {path: x[1], exact: x[2], name: x[4], component: x[3]}}).toArray();
}

// define app routing
export function DefaultRoutes() {
  Logger.log('debug', `DefaultRoutes()`);
  return (
    <Switch>
      {defaultRoutes.valueSeq().map((x, i) =>
        'PrivateRoute' === x[0]
          ? <PrivateRoute key={i} path={routePrefix + x[1]} exact={x[2]} component={x[3]} />
          : <Route key={i} path={routePrefix + x[1]} exact={x[2]} component={x[3]} />)}
      <PrivateRoute key={99999} path='/' exact={false} component={DefaultLayout} />
      <Route render={() => (<div> Sorry, this page does not exist. </div>)} />
    </Switch>
  )
}

export function MainRoutes() {
  Logger.log('debug', `MainRoutes()`);
  return (
    <Route render={({location}) => {
      return (
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} in={false} timeout={250} classNames="screen-fade">
            <Switch location={location}>
              {mainRoutes.valueSeq().map((x, i) =>
                'PrivateRoute' === x[0]
                  ? <PrivateRoute key={i} path={routePrefix + x[1]} exact={x[2]} component={x[3]} />
                  : <Route key={i} path={routePrefix + x[1]} exact={x[2]} component={x[3]} />)}
              <Route render={() => (<div> Sorry, this page does not exist. </div>)} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      )
    }} />
  );
}

Logger.log('silly', `Routes loaded.`);
