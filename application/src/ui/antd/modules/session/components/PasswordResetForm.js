import React, {Component, createRef} from 'react';
import {Link, Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Form, Input, Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';
import Config from '../../../../../Config';


class PasswordResetForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.form = createRef();
  }

  // form column settings
  layout = {
    main: {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    },
    tail: {
      wrapperCol: {
        xs: {
          span: 22,
        },
        sm: {
          offset: 8,
          span: 16,
        },
      },
    }
  }

  compareToFirstPassword = (rule, value) => {
    if (value && value !== this.form.current.getFieldValue('password1')) {
      return Promise.reject(i18next.t('feedback_validation_password_match'));
    } else {
      return Promise.resolve();
    }
  }

  parseFeedback = (errors, joinChar=' ') => {
    let firstFieldName = '';
    for (const field in errors) {
      this.form.current.setFields([{name: field, errors: errors[field]}]);
      if (firstFieldName === '') {
        firstFieldName = field;
      }
    }
    this.form.current.scrollToField(firstFieldName);
  }

  submitData = (values) => {
    Logger.log('debug', `PasswordResetForm.submit()`);

    // API POST/PUT payload
    let payload = {};
    for (const input of Object.keys(this.props.data)) {
      if (values[input]) {
        payload[input] = values[input];
      }
    }

    // register
    this.props.submit(payload, () => {
      this.parseFeedback(this.props.errors);
      if (this.props.success) {
        message.success(i18next.t('password_reset_form_message_success'));
        this.setState({redirectTo: pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))});
      } else {
        message.error(i18next.t('password_reset_form_message_failure'));
      }
    });
  }

  // form submit handler
  handleFinish = async (values) => {
    Logger.log('debug', `PasswordResetForm.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitData(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `PasswordResetForm.handleFinishFailed(###)`);
    message.error(i18next.t('password_reset_form_message_failure'));
    this.form.current.scrollToField(errorFields[0].name);
  }

  render() {

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const {isSubmitting} = this.props;

    return (
      <Translation>{(t) =>
        <div className="password-reset-form password-reset-form-step2">

          <Form
            {...this.layout.main}
            name="password_reset_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
          >

            <div className="form-group">
              <Form.Item
                name="email"
                label={t('password_reset_form_input_email_address')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {type: 'email', message: t('feedback_validation_email')}
                ]}
              >
                <Input disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="code"
                label={t('password_reset_form_input_code')}
                rules={[
                  {required: true, message: t('feedback_validation_required')}
                ]}
              >
                <Input
                  disabled={isSubmitting}
                  onChange={(e) => this.form.current.setFieldsValue({code: e.target.value.toUpperCase()})}
                />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="password1"
                label={
                  <span>
                    {t('password_reset_form_input_password1')}&nbsp;
                    <Tooltip title={t('password_form_tooltip_password')}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {min: 8, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})},
                  {pattern: /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,40}$/, message: t('feedback_validation_password_complexity')}
                ]}
              >
                <Input type="password" disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="password2"
                label={t('password_reset_form_input_password2')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {validator: this.compareToFirstPassword}
                ]}
              >
                <Input type="password" disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Form.Item {...this.layout.tail}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="password-reset-button"
                  loading={isSubmitting}
                >
                  {isSubmitting ? t('password_reset_form_button_submit_in_process') : t('password_reset_form_button_submit') }
                </Button>

                <span className="link-password-reset-step1">
                  <Link to={pathTo('PasswordResetRequestScreen')}>
                    {t('password_reset_form_link_need_code')}
                  </Link>
                </span>
              </Form.Item>
            </div>

          </Form>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `PasswordResetForm.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `PasswordResetForm.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `PasswordResetForm.componentWillUnmount()`);
    this.props.formDestroy();
  }
}

export default PasswordResetForm;
