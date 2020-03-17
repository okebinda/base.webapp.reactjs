import React, {Component, createRef} from 'react';
import i18next from 'i18next';
import {Translation} from 'react-i18next';
import {Button, Col, Form, Input, Row} from 'antd';

import Logger from '../../../../../lib/Logger';
import message from '../../../elements/lib/MessageWrapper';

class UserAccountForm extends Component {

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

  // load values from props into inputs
  setFields = () => {
    this.form.current.setFieldsValue({
      username: this.props.data.username,
      email: this.props.data.email,
      first_name: this.props.data.first_name,
      last_name: this.props.data.last_name
    });
  }

  // submit data handler
  submitData = async (values) => {
    Logger.log('debug', `UserAccountForm.submitData(###)`);

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
        message.success(i18next.t('user_account_form_message_success'));
      } else {
        message.error(i18next.t('user_account_form_message_failure'));
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
    Logger.log('debug', `UserAccountForm.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitData(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `UserAccountForm.handleFinishFailed(###)`);
    message.error(i18next.t('user_account_form_message_failure'));
    this.form.current.scrollToField(errorFields[0].name);
  }

  render() {

    const {isSubmitting, isLoading} = this.props;

    return (
      <Translation>{(t) => 
        <div className="user-account-form">
          <Form
            {...this.layout.main}
            name="user_account_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
          >

            <Row>
              <Col offset={this.layout.main.labelCol.span}>
                <h4>
                  <strong>{t('user_account_form_header_account')}</strong>
                </h4>
              </Col>
            </Row>

            <div className="form-group">
              <Form.Item
                name="username"
                label={t('user_account_form_input_username')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {min: 2, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})},
                  {pattern: /^\w+$/, message: t('feedback_validation_alphanumeric')},
                  {pattern: /(?!^\d+$)^.+$/, message: t('feedback_validation_not_number')}
                ]}
              >
                <Input disabled={isLoading || isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="email"
                label={t('user_account_form_input_email_address')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {type: 'email', message: t('feedback_validation_email')}
                ]}
              >
                <Input disabled={isLoading || isSubmitting} />
              </Form.Item>
            </div>

            <Row>
              <Col offset={this.layout.main.labelCol.span}>
                <h4>
                  <strong>{t('user_account_form_header_profile')}</strong>
                </h4>
              </Col>
            </Row>

            <div className="form-group">
              <Form.Item
                name="first_name"
                label={t('user_account_form_input_first_name')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {max: 40, message: t('feedback_validation_length', {min: 1, max: 40})}
                ]}
              >
                <Input disabled={isLoading || isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="last_name"
                label={t('user_account_form_input_last_name')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {min: 2, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})}
                ]}
              >
                <Input disabled={isLoading || isSubmitting} />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Form.Item {...this.layout.tail}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {isSubmitting ? t('user_account_form_button_submit_in_process') : t('user_account_form_button_submit') }
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
    Logger.log('silly', `UserAccountForm.componentDidMount()`);

    // initialize data from props (via the store)
    this.setFields();

    // initialize data from API
    this.props.load(() => {
      this.setFields();
    });
  }

  componentDidUpdate() {
    Logger.log('silly', `UserAccountForm.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `UserAccountForm.componentWillUnmount()`);
    this.props.formDestroy();
  }
}

export default UserAccountForm;

Logger.log('silly', `UserAccountForm loaded.`);
