import React, {Component} from 'react';
import {Translation} from 'react-i18next';

import DocumentHead from '../../../elements/components/DocumentHead';
import Logger from '../../../../../lib/Logger';


class DashboardScreen extends Component {
  render() {
    return (
      <Translation>{(t) => 
        <div>
          <DocumentHead title={t('route_dashboard')} />
          Dashboard
        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `DashboardScreen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `DashboardScreen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `DashboardScreen.componentWillUnmount()`);
  }
}

export default DashboardScreen;

Logger.log('silly', `DashboardScreen loaded.`);
