import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Translation} from 'react-i18next';
import {Col, PageHeader, Row, Steps} from 'antd';

import Logger from '../../../../../lib/Logger';
import RegisterStep1Form from '../containers/RegisterStep1FormContainer'
import TermsOfServiceModal from '../containers/TermsOfServiceModalContainer';
import DocumentHead from '../../../elements/components/DocumentHead';
import {pathTo} from '../../../Routes';
import Config from '../../../../../Config';
import '../styles/Register.less';

class RegisterStep1Screen extends Component {
  render() {

    if (this.props.isAuthenticated) {
      return <Redirect to={pathTo(Config.get('DEFAULT_LOGIN_REDIRECT'))} />;
    }
    
    return (
      <Translation>{(t) => 
        <div className="screen screen-public screen-register">

          <DocumentHead title={t('route_register_step1')} />

          <PageHeader
            onBack={() => this.props.history.push(pathTo('LoginScreen'))}
            title={t('register_screen_title')}
            subTitle={t('register_screen_form1_header')}
          />

          <div className="container-form-register">
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={22} sm={22} md={20} lg={16} xl={14}>

                <Row>

                  <Col sm={24} md={6}>
                    <Steps direction="vertical" size="small" current={0}>
                      <Steps.Step title={t('register_form_steps_step1_title')} description={t('register_form_steps_step1_description')} />
                      <Steps.Step title={t('register_form_steps_step2_title')} description={t('register_form_steps_step2_description')} />
                    </Steps>
                  </Col>

                  <Col sm={24} md={{ span: 16, offset: 2 }}>
                    <RegisterStep1Form />
                    <TermsOfServiceModal />
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
    Logger.log('silly', `RegisterStep1Screen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `RegisterStep1Screen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `RegisterStep1Screen.componentWillUnmount()`);
  }
}

export default RegisterStep1Screen;

Logger.log('silly', `RegisterStep1Screen loaded.`);
