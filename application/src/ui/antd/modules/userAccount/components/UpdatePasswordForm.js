import React, {Component, createRef} from 'react';
import i18next from 'i18next';
import {Translation} from 'react-i18next';
import {Button, Form, Icon, Input, Tooltip} from 'antd';

import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';

class UpdatePasswordForm extends Component {

  constructor(props) {
    super(props);
    this.state = this.initializeState();
    this.formTop = createRef();
  }

  initializeState = () => {
    Logger.log('debug', `UpdatePasswordForm.initializeState()`);
    return {
      ...this.formDefaults()
    }
  }

  formDefaults = () => {
    Logger.log('debug', `UpdatePasswordForm.formDefaults()`);

    let defs = {};

    // reset error messages
    for (const val of Object.keys(this.props.data)) {
      defs[val + '_InputFeedback'] = '';
    }
    return defs;
  }

  // scroll handler
  scrollToRef = (ref) => {
    if (typeof window !== 'undefined') {
      setTimeout(() => window.scrollTo(0, ref.current.offsetTop), 100);
    }
  }

  // generic input change handler
  onInputChange = (input, value) => {
    this.setState({[input + '_InputFeedback']: ''})
  }

  compareToFirstPassword = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password1')) {
      callback(i18next.t('feedback_validation_password_match'));
    } else {
      callback();
    }
  };

  // submit data handler
  submitData = async () => {
    Logger.log('debug', `UpdatePasswordForm.submitData()`);

    // client-side input vaidation
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        for (const key in err) {
          let errMessage = '';
          for (const error of err[key]['errors']) {
            if (errMessage) {
              errMessage += ' '
            }
            errMessage += error.message;
          }
          this.setState({[key + '_InputFeedback']: errMessage});
        }
        message.error(i18next.t('password_form_message_failure'));
        return;
      }

      // reset form feedback and disable submit button
      this.setState(this.formDefaults());

      // API POST/PUT payload
      let payload = {};
      for (const input of Object.keys(this.props.data)) {
        if (fieldsValue[input]) {
          payload[input] = fieldsValue[input];
        }
      }

      // update
      this.props.submit(payload, () => {
        this.setState(this.parseFeedback(this.props.errors));
        // this.scrollToRef(this.formTop);
        if (this.props.success) {
          message.success(i18next.t('password_form_message_success'));
        } else {
          message.error(i18next.t('password_form_message_failure'));
        }
      });
    });
  }

  parseFeedback = (errors, joinChar=' ') => {
    const out = {};
    for (const field in errors) {
      out[field + '_InputFeedback'] = errors[field].join(joinChar);
    }
    return out;
  }

  // form submit handler
  handleSubmit = async (evt) => {
    Logger.log('debug', `UpdatePasswordForm.handleSubmit(###)`);
    evt.preventDefault();
    if (!this.props.isSubmitting) {
      await this.submitData();
    }
  }

  render() {
    const {form, isSubmitting} = this.props;
    return (
      <Translation>{(t) => 
        <div className="password-form" ref={this.formTop}>
          <Form layout="vertical" onSubmit={this.handleSubmit}>

            <div className="form-group">
              <Form.Item
                label={t('password_form_input_previous_password')}
                validateStatus={this.state.previous_password_InputFeedback ? "error" : ''}
                hasFeedback={this.state.previous_password_InputFeedback ? true : false}
                help={this.state.previous_password_InputFeedback}
              >
                {form.getFieldDecorator('previous_password', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')}
                  ]
                })(
                  <Input type="password" onChange={(e) => this.onInputChange('previous_password', e)} />
                )}
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                label={
                  <span>
                    {t('password_form_input_password1')}&nbsp;
                    <Tooltip title={t('password_form_tooltip_password')}>
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
                validateStatus={this.state.password1_InputFeedback ? "error" : ''}
                hasFeedback={this.state.password1_InputFeedback ? true : false}
                help={this.state.password1_InputFeedback}
              >
                {form.getFieldDecorator('password1', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {min: 8, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})},
                    {pattern: /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,40}$/, message: t('feedback_validation_password_complexity')}
                  ]
                })(
                  <Input type="password" onChange={(e) => this.onInputChange('password1', e)} />
                )}
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                label={t('password_form_input_password2')}
                validateStatus={this.state.password2_InputFeedback ? "error" : ''}
                hasFeedback={this.state.password2_InputFeedback ? true : false}
                help={this.state.password2_InputFeedback}
              >
                {form.getFieldDecorator('password2', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {validator: this.compareToFirstPassword}
                  ]
                })(
                  <Input type="password" onChange={(e) => this.onInputChange('password2', e)} />
                )}
              </Form.Item>
            </div>

            <div className="form-actions">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                {isSubmitting ? t('password_form_button_submit_in_process') : t('password_form_button_submit') }
              </Button>
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

export default Form.create({name: 'password_form'})(UpdatePasswordForm);

Logger.log('silly', `UpdatePasswordForm loaded.`);
