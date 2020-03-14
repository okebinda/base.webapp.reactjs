import React, {Component, createRef} from 'react';
import i18next from 'i18next';
import {Translation} from 'react-i18next';
import {Button, Input} from 'antd';
import {Form as LegacyForm} from '@ant-design/compatible';

import Logger from '../../../../../lib/Logger';
import message from '../../../elements/lib/MessageWrapper';

class UserAccountForm extends Component {

  constructor(props) {
    super(props);
    this.state = this.initializeState();
    this.formTop = createRef();
  }

  initializeState = () => {
    Logger.log('debug', `UserAccountForm.initializeState()`);

    let state = {};
    for (const val of Object.keys(this.props.data)) {
      state[val] = '';
    }
    return {
      ...state,
      ...this.formDefaults()
    }
  }

  formDefaults = () => {
    Logger.log('debug', `UserAccountForm.formDefaults()`);

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

  // submit data handler
  submitData = async () => {
    Logger.log('debug', `UserAccountForm.submitData()`);


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
        message.error(i18next.t('user_account_form_message_failure'));
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
          message.success(i18next.t('user_account_form_message_success'));
        } else {
          message.error(i18next.t('user_account_form_message_failure'));
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
    Logger.log('debug', `UserAccountForm.handleSubmit(###)`);
    evt.preventDefault();
    if (!this.props.isSubmitting) {
      await this.submitData();
    }
  }

  render() {

    const {form, isSubmitting} = this.props;

    return (
      <Translation>{(t) => 
        <div className="user-account-form" ref={this.formTop}>
          <LegacyForm layout="vertical" onSubmit={this.handleSubmit}>

            <h4>
              <strong>{t('user_account_form_header_account')}</strong>
            </h4>

            <div className="form-group">
              <LegacyForm.Item
                label={t('user_account_form_input_username')}
                validateStatus={this.state.username_InputFeedback ? "error" : ''}
                hasFeedback={this.state.username_InputFeedback ? true : false}
                help={this.state.username_InputFeedback}
              >
                {form.getFieldDecorator('username', {
                  initialValue: this.props.data.username,
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
                label={t('user_account_form_input_email_address')}
                validateStatus={this.state.email_InputFeedback ? "error" : ''}
                hasFeedback={this.state.email_InputFeedback ? true : false}
                help={this.state.email_InputFeedback}
              >
                {form.getFieldDecorator('email', {
                  initialValue: this.props.data.email,
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {type: 'email', message: t('feedback_validation_email')}
                  ]
                })(
                  <Input onChange={(e) => this.onInputChange('email', e)} />
                )}
              </LegacyForm.Item>
            </div>

            <br />
            <h4>
              <strong>{t('user_account_form_header_profile')}</strong>
            </h4>

            <div className="form-group">
              <LegacyForm.Item
                label={t('user_account_form_input_first_name')}
                validateStatus={this.state.first_name_InputFeedback ? "error" : ''}
                hasFeedback={this.state.first_name_InputFeedback ? true : false}
                help={this.state.first_name_InputFeedback}
              >
                {form.getFieldDecorator('first_name', {
                  initialValue: this.props.data.first_name,
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {max: 40, message: t('feedback_validation_length', {min: 1, max: 40})}
                  ]
                })(
                  <Input onChange={(e) => this.onInputChange('first_name', e)} />
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={t('user_account_form_input_last_name')}
                validateStatus={this.state.last_name_InputFeedback ? "error" : ''}
                hasFeedback={this.state.last_name_InputFeedback ? true : false}
                help={this.state.last_name_InputFeedback}
              >
                {form.getFieldDecorator('last_name', {
                  initialValue: this.props.data.last_name,
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {min: 2, max: 40, message: t('feedback_validation_length', {min: 2, max: 40})}
                  ]
                })(
                  <Input onChange={(e) => this.onInputChange('last_name', e)} />
                )}
              </LegacyForm.Item>
            </div>


            <div className="form-actions">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                {isSubmitting ? t('user_account_form_button_submit_in_process') : t('user_account_form_button_submit') }
              </Button>
            </div>

          </LegacyForm>
        </div>
      }</Translation>
    )
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `UserAccountForm.componentDidMount()`);

    // initialize data from props (via the store)
    this.setState(this.props.data);

    // initialize data from API
    this.props.load(() => {
      this.setState(this.props.data);
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

export default LegacyForm.create({ name: 'user_account_form' })(UserAccountForm);

Logger.log('silly', `UserAccountForm loaded.`);
