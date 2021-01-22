import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Col, PageHeader, Row, Steps} from 'antd';

import Logger from '../../../../../lib/Logger';
import PasswordResetRequestForm from '../containers/PasswordResetRequestFormContainer';
import {pathTo} from '../../../Routes';
import DocumentHead from '../../../elements/components/DocumentHead';
import '../styles/PasswordReset.less';

class PasswordResetRequestScreen extends Component {
  render() {
    return (
      <Translation>{(t) => 
        <div className="screen screen-public screen-password-reset">

          <DocumentHead title={t('route_password_reset_request')} />

          <PageHeader
            onBack={() => this.props.history.push(pathTo('LoginScreen'))}
            title={t('password_reset_screen_title')}
            subTitle={t('password_reset_screen_form1_header')}
          />

          <div className="container-form-password-reset">
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={22} sm={22} md={20} lg={16} xl={14}>

                <Row>

                  <Col sm={24} md={6}>
                    <Steps direction="vertical" size="small" current={0}>
                      <Steps.Step title={t('password_reset_form_steps_step1_title')} description={t('password_reset_form_steps_step1_description')} />
                      <Steps.Step title={t('password_reset_form_steps_step2_title')} description={t('password_reset_form_steps_step2_description')} />
                    </Steps>
                  </Col>

                  <Col sm={24} md={{ span: 16, offset: 2 }}>
                    <PasswordResetRequestForm />

                    <Row>
                      <Col xs={24} sm={{ span: 16, offset: 8 }}>
                        <div className="password-reset-instructions">
                          <p>{t('password_reset_screen_instructions')}</p>
                        </div>
                      </Col>
                    </Row>
                    
                  </Col>

                </Row>

              </Col>
            </Row>
          </div>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `PasswordResetRequestScreen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `PasswordResetRequestScreen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `PasswordResetRequestScreen.componentWillUnmount()`);
  }
}

export default PasswordResetRequestScreen;

Logger.log('silly', `PasswordResetRequestScreen loaded.`);
