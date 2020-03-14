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
    this.state = this.initialState();
    this.formTop = createRef();
  }

  initialState = () => {
    return {
      ...this.formDefaults(),
    }
  }

  formDefaults = () => {
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

  parseFeedback = (errors, joinChar=' ') => {
    const out = {};
    for (const field in errors) {
      out[field + '_InputFeedback'] = errors[field].join(joinChar);
    }
    return out;
  }

  submit = () => {
    Logger.log('debug', `PasswordResetRequestForm.submit()`);

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
        message.error(i18next.t('password_reset_request_form_message_failure'));
        return;
      }

      // reset form feedback
      this.setState(this.formDefaults());
      
      // API POST/PUT payload
      let payload = {};
      for (const input of Object.keys(this.props.data)) {
        if (fieldsValue[input]) {
          payload[input] = fieldsValue[input];
        }
      }

      // register
      this.props.submit(payload, () => {
        this.setState(this.parseFeedback(this.props.errors));
        // this.scrollToRef(this.formTop);
        if (this.props.success) {
          message.success(i18next.t('password_reset_request_form_message_success'));
          this.setState({redirectTo: pathTo('PasswordResetScreen') });
        } else {
          message.error(i18next.t('password_reset_request_form_message_failure'));
        }
      });
    });
  }

  // form submit handler
  handleSubmit = async (evt) => {
    Logger.log('debug', `PasswordResetRequestForm.handleSubmit(###)`);
    evt.preventDefault();
    if (!this.props.isSubmitting) {
      await this.submit();
    }
  }

  render() {

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const {isSubmitting, form} = this.props;

    return (
      <Translation>{(t) =>
        <div className="password-reset-form password-reset-form-step1" ref={this.formTop}>

          <Form layout="vertical" onSubmit={this.handleSubmit}>

            <div className="form-group">
              <Form.Item
                label={t('password_reset_request_form_input_email_address')}
                validateStatus={this.state.email_InputFeedback ? "error" : ''}
                hasFeedback={this.state.email_InputFeedback ? true : false}
                help={this.state.email_InputFeedback}
              >
                {form.getFieldDecorator('email', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {type: 'email', message: t('feedback_validation_email')}
                  ]
                })(
                  <Input onChange={(e) => this.onInputChange('email', e)} />
                )}
              </Form.Item>
            </div>

            <div className="form-actions">

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

export default Form.create({name: 'password_reset_request_form'})(PasswordResetRequestForm);
