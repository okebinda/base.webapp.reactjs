import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Col, PageHeader, Row, Steps} from 'antd';

import Logger from '../../../../../lib/Logger';
import RegisterStep2Form from '../containers/RegisterStep2FormContainer'
import DocumentHead from '../../../elements/components/DocumentHead';
import {pathTo} from '../../../Routes';
import '../styles/Register.scss';

class RegisterStep2Screen extends Component {

  render() {
    return (
      <Translation>{(t) => 
        <div className="screen screen-public screen-register">

          <DocumentHead title={t('route_register_step2')} />

          <PageHeader
            onBack={() => this.props.history.push(pathTo('RegisterStep1Screen'))}
            title={t('register_screen_title')}
            subTitle={t('register_screen_form2_header')}
          />

          <div className="container-form-register">
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={22} sm={22} md={20} lg={16} xl={14}>

                <Row>

                  <Col sm={24} md={6}>
                    <Steps direction="vertical" size="small" current={1}>
                      <Steps.Step title={t('register_form_steps_step1_title')} description={t('register_form_steps_step1_description')} />
                      <Steps.Step title={t('register_form_steps_step2_title')} description={t('register_form_steps_step2_description')} />
                    </Steps>
                  </Col>

                  <Col sm={24} md={{ span: 16, offset: 2 }}>
                    <RegisterStep2Form />
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
    Logger.log('silly', `RegisterStep2Screen.componentDidMount()`);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  componentDidUpdate() {
    Logger.log('silly', `RegisterStep2Screen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `RegisterStep2Screen.componentWillUnmount()`);
  }
}

export default RegisterStep2Screen;

Logger.log('silly', `RegisterStep2Screen loaded.`);
