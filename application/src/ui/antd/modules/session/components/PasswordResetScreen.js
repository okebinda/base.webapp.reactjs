import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Col, PageHeader, Row, Steps} from 'antd';

import Logger from '../../../../../lib/Logger';
import PasswordResetForm from '../containers/PasswordResetFormContainer';
import {pathTo} from '../../../Routes';
import DocumentHead from '../../../elements/components/DocumentHead';
import '../styles/PasswordReset.scss';

class PasswordResetScreen extends Component {
  render() {
    return (
      <Translation>{(t) => 
        <div className="screen screen-public screen-password-reset">

          <DocumentHead title={t('route_password_reset')} />

          <PageHeader
            onBack={() => this.props.history.push(pathTo('LoginScreen'))}
            title={t('password_reset_screen_title')}
            subTitle={t('password_reset_screen_form2_header')}
          />

          <div className="container-form-password-reset">
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={22} sm={22} md={20} lg={16} xl={14}>

                <Row>

                  <Col sm={24} md={6}>
                    <Steps direction="vertical" size="small" current={1}>
                      <Steps.Step title={t('password_reset_form_steps_step1_title')} description={t('password_reset_form_steps_step1_description')} />
                      <Steps.Step title={t('password_reset_form_steps_step2_title')} description={t('password_reset_form_steps_step2_description')} />
                    </Steps>
                  </Col>

                  <Col sm={24} md={{ span: 16, offset: 2 }}>
                    <PasswordResetForm />
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
    Logger.log('silly', `PasswordResetScreen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `PasswordResetScreen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `PasswordResetScreen.componentWillUnmount()`);
  }
}

export default PasswordResetScreen;

Logger.log('silly', `PasswordResetScreen loaded.`);
