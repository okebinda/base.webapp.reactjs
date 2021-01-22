import React, {Component, createRef} from 'react';
import {Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Checkbox, Form, Input, Tooltip} from 'antd';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';


class RegisterStep1Form extends Component {

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
    if (value && value !== this.form.current.getFieldValue('password')) {
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
    Logger.log('debug', `RegisterStep1Form.submit()`);
      
    // API POST/PUT payload
    let payload = {};
    for (const input of Object.keys(this.props.data)) {
      if (values[input]) {
        payload[input] = values[input];
      }
    }
    if (values['tos_id']) {
      payload['tos_id'] = this.props.tos_id;
    }

    // register
    this.props.submit(payload, () => {
      this.parseFeedback(this.props.errors);
      if (this.props.success) {
        this.props.createSession(
          {
            username: payload.username,
            password: payload.password
          },
          () => {
            this.setState({redirectTo: pathTo('RegisterStep2Screen')});
          }
        );
      } else {
        message.error(i18next.t('register_form1_message_failure'));
      }
    });
  }

  // form submit handler
  handleFinish = async (values) => {
    Logger.log('debug', `RegisterStep1Form.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitData(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `RegisterStep1Form.handleFinishFailed(###)`);
    message.error(i18next.t('register_form1_message_failure'));
    this.form.current.scrollToField(errorFields[0].name);
  }

  render() {

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const {isSubmitting} = this.props;

    return (
      <Translation>{(t) =>
        <div className="register-form register-form-step1">

          <Form
            {...this.layout.main}
            name="register_step1_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
            initialValues={{
              tos_id: false
            }}
          >

            <div className="form-group">
              <Form.Item
                name="username"
                label={t('register_form1_input_username')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {min: 2, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})},
                  {pattern: /^\w+$/, message: t('feedback_validation_alphanumeric')},
                  {pattern: /(?!^\d+$)^.+$/, message: t('feedback_validation_not_number')}
                ]}
              >
                <Input disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="email"
                label={t('register_form1_input_email_address')}
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
                name="password"
                label={
                  <span>
                    {t('register_form1_input_password1')}&nbsp;
                    <Tooltip title={t('register_form1_tooltip_password')}>
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
                <Input.Password disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="password2"
                label={t('register_form1_input_password2')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {validator: this.compareToFirstPassword}
                ]}
              >
                <Input.Password disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="tos_id"
                valuePropName="checked"
                {...this.layout.tail}
                rules={[
                  {
                    required: true,
                    transform: value => (value || undefined),
                    type: 'boolean',
                    message: t('feedback_validation_tos')
                  }
                ]}
              >
                <Checkbox disabled={isSubmitting}>
                  {t('register_form1_input_tos')}
                </Checkbox>
              </Form.Item>
            </div>

            <div className="form-actions">
              <Form.Item {...this.layout.tail}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                  loading={isSubmitting}
                >
                  {t('register_form1_button_submit')}
                </Button>
              </Form.Item>
            </div>

          </Form>

        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    this.props.loadTermsOfServiceCurrent();
    Logger.log('silly', `RegisterStep1Form.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `RegisterStep1Form.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `RegisterStep1Form.componentWillUnmount()`);
    this.props.formDestroy();
  }
}

export default RegisterStep1Form;
