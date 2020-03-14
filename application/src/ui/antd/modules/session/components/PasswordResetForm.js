import React, {Component, createRef} from 'react';
import {Link, Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Input, Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {Form as LegacyForm} from '@ant-design/compatible';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Logger from '../../../../../lib/Logger';
import Config from '../../../../../Config';


class PasswordResetForm extends Component {

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
    if (value && value !== form.getFieldValue('password1')) {
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
    Logger.log('debug', `PasswordResetForm.submit()`);

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
        message.error(i18next.t('password_reset_form_message_failure'));
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
          message.success(i18next.t('password_reset_form_message_success'));
          this.setState({redirectTo: pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))});
        } else {
          message.error(i18next.t('password_reset_form_message_failure'));
        }
      });
    });
  }

  // form submit handler
  handleSubmit = async (evt) => {
    Logger.log('debug', `PasswordResetForm.handleSubmit(###)`);
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
        <div className="password-reset-form password-reset-form-step2" ref={this.formTop}>

          <LegacyForm layout="vertical" onSubmit={this.handleSubmit}>

            <div className="form-group">
              <LegacyForm.Item
                label={t('password_reset_form_input_email_address')}
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
                label={t('password_reset_form_input_code')}
                validateStatus={this.state.code_InputFeedback ? "error" : ''}
                hasFeedback={this.state.code_InputFeedback ? true : false}
                help={this.state.code_InputFeedback}
              >
                {form.getFieldDecorator('code', {
                  onChange: (e) => {
                    this.onInputChange('code', e);
                    e.target.value = e.target.value.toUpperCase();
                  },
                  rules: [
                    {required: true, message: t('feedback_validation_required')}
                  ]
                })(
                  <Input />
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={
                  <span>
                    {t('password_reset_form_input_password1')}&nbsp;
                    <Tooltip title={t('password_form_tooltip_password')}>
                      <QuestionCircleOutlined />
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
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={t('password_reset_form_input_password2')}
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
              </LegacyForm.Item>
            </div>

            <div className="form-actions">

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

            </div>

          </LegacyForm>

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

export default LegacyForm.create({name: 'password_reset_form'})(PasswordResetForm);
