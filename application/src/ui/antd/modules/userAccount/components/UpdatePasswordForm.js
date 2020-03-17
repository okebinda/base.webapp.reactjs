import React, {Component, createRef} from 'react';
import i18next from 'i18next';
import {Translation} from 'react-i18next';
import {Button, Form, Input, Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';

import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';

class UpdatePasswordForm extends Component {

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

  // submit data handler
  submitData = async (values) => {
    Logger.log('debug', `UpdatePasswordForm.submitData(###)`);

    // API POST/PUT payload
    let payload = {};
    for (const input of Object.keys(this.props.data)) {
      if (values[input]) {
        payload[input] = values[input];
      }
    }

    // update
    this.props.submit(payload, () => {
      this.parseFeedback(this.props.errors);
      if (this.props.success) {
        message.success(i18next.t('password_form_message_success'));
      } else {
        message.error(i18next.t('password_form_message_failure'));
      }
    });
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

  // form submit handler
  handleFinish = async (values) => {
    Logger.log('debug', `UpdatePasswordForm.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitData(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `UpdatePasswordForm.handleFinishFailed(###)`);
    message.error(i18next.t('password_form_message_failure'));
    this.form.current.scrollToField(errorFields[0].name);
  }

  render() {

    const {isSubmitting} = this.props;

    return (
      <Translation>{(t) => 
        <div className="password-form">
          <Form
            {...this.layout.main}
            name="password_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
          >

            <div className="form-group">
              <Form.Item
                name="previous_password"
                label={t('password_form_input_previous_password')}
                rules={[
                  {required: true, message: t('feedback_validation_required')}
                ]}
              >
                <Input type="password" disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="password1"
                label={
                  <span>
                    {t('password_form_input_password1')}&nbsp;
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
                label={t('password_form_input_password2')}
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
                  loading={isSubmitting}
                >
                  {isSubmitting ? t('password_form_button_submit_in_process') : t('password_form_button_submit') }
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
    Logger.log('silly', `UpdatePasswordForm.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `UpdatePasswordForm.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `UpdatePasswordForm.componentWillUnmount()`);
    this.props.formDestroy();
  }
}

export default UpdatePasswordForm;

Logger.log('silly', `UpdatePasswordForm loaded.`);
