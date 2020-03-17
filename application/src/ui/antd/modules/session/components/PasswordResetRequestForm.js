import React, {Component, createRef} from 'react';
import {Link, Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Form, Input} from 'antd';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';


class PasswordResetRequestForm extends Component {

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
    Logger.log('debug', `PasswordResetRequestForm.submit()`);
      
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
        message.success(i18next.t('password_reset_request_form_message_success'));
        this.setState({redirectTo: pathTo('PasswordResetScreen') });
      } else {
        message.error(i18next.t('password_reset_request_form_message_failure'));
      }
    });
  }

  // form submit handler
  handleFinish = async (values) => {
    Logger.log('debug', `PasswordResetRequestForm.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitData(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `PasswordResetRequestForm.handleFinishFailed(###)`);
    message.error(i18next.t('password_reset_request_form_message_failure'));
    this.form.current.scrollToField(errorFields[0].name);
  }

  render() {

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const {isSubmitting} = this.props;

    return (
      <Translation>{(t) =>
        <div className="password-reset-form password-reset-form-step1">

          <Form
            {...this.layout.main}
            name="password_reset_request_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
          >

            <div className="form-group">
              <Form.Item
                name="email"
                label={t('password_reset_request_form_input_email_address')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {type: 'email', message: t('feedback_validation_email')}
                ]}
              >
                <Input disabled={isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Form.Item {...this.layout.tail}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="password-reset-request-button"
                  loading={isSubmitting}
                >
                  {isSubmitting ? t('password_reset_request_form_button_submit_in_process') : t('password_reset_request_form_button_submit') }
                </Button>

                <span className="link-password-reset-step2">
                  <Link to={pathTo('PasswordResetScreen')}>
                    {t('password_reset_request_form_link_have_code')}
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
    Logger.log('silly', `PasswordResetRequestForm.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `PasswordResetRequestForm.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `PasswordResetRequestForm.componentWillUnmount()`);
    this.props.formDestroy();
  }
}

export default PasswordResetRequestForm;
