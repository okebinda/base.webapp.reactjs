import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Col, PageHeader, Row} from 'antd';

import Logger from '../../../../../lib/Logger';
import LoginForm from '../containers/LoginFormContainer'
import DocumentHead from '../../../elements/components/DocumentHead';
import '../styles/Login.scss';

class LoginScreen extends Component {

  render() {
    return (
      <Translation>{(t) => 
        <div className="screen screen-public screen-login">

          <DocumentHead title={t('route_login')} />

          <PageHeader
            title={t('login_screen_title')}
          />

          <div className="container-form-login">
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={22} sm={16} md={12} lg={10} xl={8}>

                <h1 style={{textAlign: "center"}}>{t('app_name')}</h1>
                <LoginForm location={this.props.location} />

              </Col>
            </Row>
          </div>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `LoginScreen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `LoginScreen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `LoginScreen.componentWillUnmount()`);
  }
}

export default LoginScreen;

Logger.log('silly', `LoginScreen loaded.`);
