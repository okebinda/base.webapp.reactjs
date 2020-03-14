import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Card, Col, Row, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

import UserAccountForm from '../containers/UserAccountFormContainer';
import UpdatePasswordForm from '../containers/UpdatePasswordFormContainer';
import DocumentHead from '../../../elements/components/DocumentHead';
import Logger from '../../../../../lib/Logger';

class UserAccountScreen extends Component {

  scrollToTop = () => {
    Logger.log('debug', `UserAccountScreen.scrollToTop()`);
    if (typeof window !== 'undefined') {
      setTimeout(() => window.scrollTo(0, 0), 100);
    }
  }

  render() {
    const loadingIcon = <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />;
    return (
      <Translation>{(t) => 
        <div>

          <DocumentHead title={t('route_user_account')} />

          <Row gutter={24}>
            <Col md={24} lg={12}>
              <Card title={t('user_account_form_title')} extra={this.props.isLoading ? loadingIcon : null}>
                <UserAccountForm />
              </Card>
            </Col>
            <Col md={24} lg={12}>
              <Card title={t('password_form_title')}>
                <UpdatePasswordForm />
              </Card>
            </Col>
          </Row>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `UserAccountScreen.componentDidMount()`);
    this.scrollToTop();
  }

  componentDidUpdate() {
    Logger.log('silly', `UserAccountScreen.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `UserAccountScreen.componentWillUnmount()`);
  }
}

export default UserAccountScreen;

Logger.log('silly', `UserAccountScreen loaded.`);
