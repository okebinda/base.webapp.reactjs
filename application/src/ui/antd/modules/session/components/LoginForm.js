import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Input, Button, Checkbox} from 'antd';
import {Form as LegacyForm} from '@ant-design/compatible';

import Logger from '../../../../../lib/Logger';
import Config from '../../../../../Config';
import message from '../../../elements/lib/MessageWrapper';
import {pathTo, hasRoute} from '../../../Routes';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      username: '',
      password:''
    };
  }

  // generic input change handler
  onInputChange = (input, evt) => {
    this.setState({[input]: evt.target.value});
  }

  // submit credentials handler
  submitCredentials = async (payload) => {
    Logger.log('debug', `LoginForm.submitCredentials()`);

    // create session
    this.props.createSession(payload, () => {
      if (this.props.success) {
          this.setState({redirectToReferrer: true});
      } else {
        message.error(i18next.t('login_form_message_failure'));
      }
    });
  }

  // form submit handler
  handleSubmit = async (evt) => {
    Logger.log('debug', `LoginForm.handleSubmit(###)`);
    evt.preventDefault();
    if (!this.props.isLoading) {
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          await this.submitCredentials(values);
        } else {
          message.error(i18next.t('login_form_message_failure'));
        }
      });
    }
  }

  render() {
    const {form, isSubmitting} = this.props;
    const {from} = this.props.location.state || { from: { pathname: pathTo(Config.get('DEFAULT_LOGIN_REDIRECT')) } }
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <Translation>{(t) => 
        <div>
          <LegacyForm layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>

            <LegacyForm.Item label={t('login_form_input_username')}>
              {form.getFieldDecorator('username', {
                initialValue: '',
                rules: [{ required: true, message: t('feedback_validation_required') }],
              })(<Input autoFocus />)}
            </LegacyForm.Item>

            <LegacyForm.Item label={t('login_form_input_password')}>
              {form.getFieldDecorator('password', {
                initialValue: '',
                rules: [{ required: true, message: t('feedback_validation_required') }],
              })(<Input.Password />)}
            </LegacyForm.Item>

            <LegacyForm.Item>
              {form.getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>{t('login_form_input_remember')}</Checkbox>)}
              <Link
                to={pathTo('PasswordResetRequestScreen')}
                className="link-forgot-password"
              >
                {t('login_form_button_forgot_password')}
              </Link>
            </LegacyForm.Item>

            <div className="form-actions">

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
              
            </div>

          </LegacyForm>
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

const WrappedLoginForm = LegacyForm.create({ name: 'login_form' })(LoginForm);
export default WrappedLoginForm;

Logger.log('silly', `LoginForm loaded.`);
