import React, {Component, createRef} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Checkbox, Form, Input} from 'antd';

import Logger from '../../../../../lib/Logger';
import Config from '../../../../../Config';
import message from '../../../elements/lib/MessageWrapper';
import {pathTo, hasRoute} from '../../../Routes';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
    };
    this.form = createRef();
  }

  // form column settings
  layout = {
    main: {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    },
    tail: {
      wrapperCol: {
        xs: {
          span: 22,
        },
        sm: {
          offset: 6,
          span: 18,
        },
      },
    }
  }

  // submit credentials handler
  submitCredentials = async (payload) => {
    Logger.log('debug', `LoginForm.submitCredentials()`);

    // create session
    this.props.createSession(payload, (success) => {
      if (success) {
          // this.setState({redirectToReferrer: true});  // disabled: LoginScreen handes any authenticated redirect
      } else {
        message.error(i18next.t('login_form_message_failure'));
      }
    });
  }

  // form submit handler
  handleFinish = async (values) => {
    Logger.log('debug', `LoginForm.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitCredentials(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `LoginForm.handleFinishFailed(###)`);
    message.error(i18next.t('login_form_message_failure'));
  }

  render() {
    const {isSubmitting} = this.props;
    const {from} = this.props.location.state || { from: { pathname: pathTo(Config.get('DEFAULT_LOGIN_REDIRECT')) } }
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <Translation>{(t) => 
        <div>
          <Form
            hideRequiredMark
            {...this.layout.main}
            name="login_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
            initialValues={{
              remember: true
            }}
          >

            <Form.Item
              name="username"
              label={t('login_form_input_username')}
              rules={[
                { required: true, message: t('feedback_validation_required') }
              ]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('login_form_input_password')}
              rules={[
                { required: true, message: t('feedback_validation_required') }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...this.layout.tail}>
              <Form.Item
                name="remember"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>{t('login_form_input_remember')}</Checkbox>
              </Form.Item>
              <Link
                to={pathTo('PasswordResetRequestScreen')}
                className="link-forgot-password"
              >
                {t('login_form_button_forgot_password')}
              </Link>
            </Form.Item>
            

            <div className="form-actions">
              <Form.Item {...this.layout.tail}>
                <Button
                  type="primary"
                  className="login-button"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {t('login_form_button_submit')}
                </Button>

                {hasRoute('RegisterStep1Screen')
                  ? <span className="">
                      <Link to={pathTo('RegisterStep1Screen')} className="">
                      {t('login_form_link_register')}
                      </Link>{' '}
                      {t('login_form_text_register')}
                    </span>
                  : null}
              </Form.Item>
            </div>

          </Form>
        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `LoginForm.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `LoginForm.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `LoginForm.componentWillUnmount()`);
  }
}

export default LoginForm;

Logger.log('silly', `LoginForm loaded.`);
