import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Translation} from 'react-i18next';

import {pathTo} from '../Routes';
import Config from '../../../Config';
import Logger from '../../../lib/Logger';


class HomeScreen extends Component {

  render() {
    return (
      <Translation>{(t) => 
        <>
          <Redirect to={pathTo(Config.get('DEFAULT_LOGIN_REDIRECT'))} />
        </>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `HomeScreen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `HomeScreen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `HomeScreen.componentWillUnmount()`);
  }
}

export default HomeScreen;

Logger.log('silly', `HomeScreen loaded.`);
