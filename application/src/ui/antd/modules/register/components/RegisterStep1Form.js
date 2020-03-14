import React, {Component, createRef} from 'react';
import {Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Checkbox, Input, Tooltip} from 'antd';
import {Form as LegacyForm, Icon as LegacyIcon} from '@ant-design/compatible';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';


class RegisterStep1Form extends Component {

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

  compareToFirstPassword = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(i18next.t('feedback_validation_password_match'));
    } else {
      callback();
    }
  };

  parseFeedback = (errors, joinChar=' ') => {
    const out = {};
    for (const field in errors) {
      out[field + '_InputFeedback'] = errors[field].join(joinChar);
    }
    return out;
  }

  submit = () => {
    Logger.log('debug', `RegisterStep1Form.submit()`);

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
        message.error(i18next.t('register_form1_message_failure'));
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
      if (fieldsValue['tos_id']) {
        payload['tos_id'] = this.props.tos_id;
      }

      // register
      this.props.submit(payload, () => {
        this.setState(this.parseFeedback(this.props.errors));
        // this.scrollToRef(this.formTop);
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
    });
  }

  // form submit handler
  handleSubmit = async (evt) => {
    Logger.log('debug', `RegisterStep1Form.handleSubmit(###)`);
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
        <div className="register-form register-form-step1" ref={this.formTop}>

          <LegacyForm layout="vertical" onSubmit={this.handleSubmit}>

            <div className="form-group">
              <LegacyForm.Item
                label={t('register_form1_input_username')}
                validateStatus={this.state.username_InputFeedback ? "error" : ''}
                hasFeedback={this.state.username_InputFeedback ? true : false}
                help={this.state.username_InputFeedback}
              >
                {form.getFieldDecorator('username', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {min: 2, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})},
                    {pattern: /^\w+$/, message: t('feedback_validation_alphanumeric')},
                    {pattern: /(?!^\d+$)^.+$/, message: t('feedback_validation_not_number')}
                  ]
                })(
                  <Input onChange={(e) => this.onInputChange('username', e)} />
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={t('register_form1_input_email_address')}
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
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={
                  <span>
                    {t('register_form1_input_password1')}&nbsp;
                    <Tooltip title={t('register_form1_tooltip_password')}>
                      <LegacyIcon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
                validateStatus={this.state.password_InputFeedback ? "error" : ''}
                hasFeedback={this.state.password_InputFeedback ? true : false}
                help={this.state.password_InputFeedback}
              >
                {form.getFieldDecorator('password', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {min: 8, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})},
                    {pattern: /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,40}$/, message: t('feedback_validation_password_complexity')}
                  ]
                })(
                  <Input.Password onChange={(e) => this.onInputChange('password', e)} />
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={t('register_form1_input_password2')}
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
                  <Input.Password onChange={(e) => this.onInputChange('password2', e)} />
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                validateStatus={this.state.tos_id_InputFeedback ? "error" : ''}
                help={this.state.tos_id_InputFeedback}
              >
                {form.getFieldDecorator('tos_id', {
                  initialValue: false,
                  rules: [
                    {
                      required: true,
                      transform: value => (value || undefined),
                      type: 'boolean',
                      message: t('feedback_validation_tos')
                    }
                  ]
                })(
                  <Checkbox onChange={(e) => this.onInputChange('tos_id', e)}>
                    {t('register_form1_input_tos')}
                  </Checkbox>
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-actions">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                {isSubmitting ? t('register_form1_button_submit_in_process') : t('register_form1_button_submit') }
              </Button>
            </div>

          </LegacyForm>

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

export default LegacyForm.create({name: 'register_step1_form'})(RegisterStep1Form);
