import React, {Component, createRef} from 'react';
import {Redirect} from 'react-router-dom'
import {Translation} from 'react-i18next';
import i18next from 'i18next';
import {Button, Input} from 'antd';
import {Form as LegacyForm} from '@ant-design/compatible';

import {pathTo} from '../../../Routes';
import message from '../../../elements/lib/MessageWrapper';
import Config from '../../../../../Config';
import Logger from '../../../../../lib/Logger';


class RegisterStep2Form extends Component {

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

  // submit registration step 2 handler
  submit = async () => {
    Logger.log('debug', `RegisterStep2Form.submitRegistrationStep2()`);

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
        message.error(i18next.t('register_form2_message_failure'));
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

      this.props.submit(payload, () => {
        this.setState(this.parseFeedback(this.props.errors));
        if (this.props.success) {
          message.success(i18next.t('register_form2_message_success'));
          this.setState({redirectTo: pathTo(Config.get('DEFAULT_LOGIN_REDIRECT')) });
        } else {
          // this.scrollToRef(this.formTop);
          message.error(i18next.t('register_form2_message_failure'));
        }
      });
    });
  }

  // form submit handler
  handleSubmit = async (evt) => {
    Logger.log('debug', `RegisterStep2Form.handleSubmit(###)`);
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
        <div className="register-form register-form-step2" ref={this.formTop}>

          <LegacyForm layout="vertical" onSubmit={this.handleSubmit}>

            <div className="form-group">
              <LegacyForm.Item
                label={t('register_form2_input_first_name')}
                validateStatus={this.state.first_name_InputFeedback ? "error" : ''}
                hasFeedback={this.state.first_name_InputFeedback ? true : false}
                help={this.state.first_name_InputFeedback}
              >
                {form.getFieldDecorator('first_name', {
                  rules: [
                    {required: true, message: t('feedback_validation_required')},
                    {min: 1, max: 40, message: t('feedback_validation_length', {min: 1, max: 40})}
                  ]
                })(
                  <Input onChange={(e) => this.onInputChange('first_name', e)} />
                )}
              </LegacyForm.Item>
            </div>

            <div className="form-group">
              <LegacyForm.Item
                label={t('register_form2_input_last_name')}
                validateStatus={this.state.last_name_InputFeedback ? "error" : ''}
                hasFeedback={this.state.last_name_InputFeedback ? true : false}
                help={this.state.last_name_InputFeedback}
              >
                {form.getFieldDecorator('last_name', {
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
                {isSubmitting ? t('register_form2_button_submit_in_process') : t('register_form2_button_submit') }
              </Button>
            </div>

          </LegacyForm>
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

export default LegacyForm.create({name: 'register_step2_form'})(RegisterStep2Form);
