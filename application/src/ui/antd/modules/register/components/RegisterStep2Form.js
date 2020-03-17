import React, {Component, createRef} from 'react';
import {Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Form, Input} from 'antd';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Config from '../../../../../Config';
import Logger from '../../../../../lib/Logger';


class RegisterStep2Form extends Component {

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

  // submit registration step 2 handler
  submitData = (values) => {
    Logger.log('debug', `RegisterStep2Form.submitRegistrationStep2()`);
      
    // API POST/PUT payload
    let payload = {};
    for (const input of Object.keys(this.props.data)) {
      if (values[input]) {
        payload[input] = values[input];
      }
    }

    this.props.submit(payload, () => {
      this.parseFeedback(this.props.errors);
      if (this.props.success) {
        message.success(i18next.t('register_form2_message_success'));
        this.setState({redirectTo: pathTo(Config.get('DEFAULT_LOGIN_REDIRECT')) });
      } else {
        message.error(i18next.t('register_form2_message_failure'));
      }
    });
  }

  // form submit handler
  handleFinish = async (values) => {
    Logger.log('debug', `RegisterStep2Form.handleFinish(###)`);
    if (!this.props.isSubmitting) {
      await this.submitData(values);
    }
  }

  // form error handler
  handleFinishFailed = ({values, errorFields, outOfDate}) => {
    Logger.log('debug', `RegisterStep2Form.handleFinishFailed(###)`);
    message.error(i18next.t('register_form2_message_failure'));
    this.form.current.scrollToField(errorFields[0].name);
  }

  render() {
    
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const {isSubmitting} = this.props;

    return (
      <Translation>{(t) =>
        <div className="register-form register-form-step2">

          <Form
            {...this.layout.main}
            name="register_step2_form"
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            ref={this.form}
          >

            <div className="form-group">
              <Form.Item
                name="first_name"
                label={t('register_form2_input_first_name')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {min: 1, max: 40, message: t('feedback_validation_length', {min: 1, max: 40})}
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="last_name"
                label={t('register_form2_input_last_name')}
                rules={[
                  {required: true, message: t('feedback_validation_required')},
                  {min: 2, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})}
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Form.Item {...this.layout.tail}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {isSubmitting ? t('register_form2_button_submit_in_process') : t('register_form2_button_submit') }
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
    Logger.log('silly', `RegisterStep2Form.componentDidMount()`);
  }

  componentDidUpdate() {
    Logger.log('silly', `RegisterStep2Form.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `RegisterStep2Form.componentWillUnmount()`);
    this.props.formDestroy();
  }
}

export default RegisterStep2Form;
