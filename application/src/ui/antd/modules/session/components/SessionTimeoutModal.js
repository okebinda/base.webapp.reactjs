import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Translation} from 'react-i18next';
import {Button, Modal} from 'antd';

import {pathTo} from '../../../Routes';
import Logger from '../../../../../lib/Logger';
import Config from '../../../../../Config';

const SignOutButton = withRouter(({history, text, destroySession, toggle}) => (
  <Button 
    key="close"
    type="danger"
    onClick={() => {
      destroySession(() => history.push(pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))));
      toggle();
    }}>{text}</Button>
));

const ExtendSessionButton = ({text, createSession, authToken, toggle}) => (
  <Button 
    key="extend"
    type="primary"
    onClick={() => {
      createSession({username: authToken});
      toggle();
    }}>{text}</Button>
);

class SessionTimeoutModal extends Component {

  static defaultProps = {
    storageType: 'session'
  }

  defaultTimer = Config.get('SESSION_TIMEOUT_COUNTDOWN'); // seconds
  timeoutBuffer = 60; // seconds - to make sure we end session in client gracefully before API does a hard deauth

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      timer: this.defaultTimer
    };
    this.toggle = this.toggle.bind(this);
    this.timeout = null;
    this.countdownTimer = null;
  }

  toggle() {
    Logger.log('debug', `SessionTimeoutModal.toggle()`);
    clearInterval(this.countdownTimer);
    this.setState(prevState => ({
      visible: !prevState.visible
    }));
  }

  modalTimer() {
    Logger.log('debug', `SessionTimeoutModal.modalTimer()`);
    if (this.props.authExpires) {
      const now =  Math.round(new Date().getTime()/1000);
      const showModalMs = (this.props.authExpires - now - this.defaultTimer - this.timeoutBuffer) * 1000;
      if (showModalMs > 0) {

        this.timeout = setTimeout(() => {
          this.toggle();

          let timeleft = this.defaultTimer;
          this.countdownTimer = setInterval(() => {
            timeleft -= 1;
            this.setState({timer: timeleft});
            if(timeleft <= 0){
              this.props.destroySession(() => this.props.history.push(pathTo(Config.get('DEFAULT_LOGIN_SCREEN'))));
              this.toggle();
            }
          }, 1000);

        }, showModalMs);

        Logger.log('debug', `SessionTimeoutModal.modalTimer, showModalMs: ${showModalMs}`);
        return;
      }
      this.timeout = null;
    }
  }

  render() {
    return (
      <Translation>{(t) => 
        <Modal 
          title={t('session_timeout_modal_title')}
          visible={this.state.visible}
          onCancel={this.toggle} className={this.props.className}
          afterClose={() => {
            this.setState({timer: this.defaultTimer});
          }}
          footer={[
            <SignOutButton
              text={t('session_timeout_modal_signout')}
              destroySession={this.props.destroySession}
              toggle={this.toggle}
            />,
            <ExtendSessionButton
              text={t('session_timeout_modal_extend')}
              createSession={this.props.createSession}
              authToken={this.props.authToken}
              toggle={this.toggle}
            />
          ]}
        >
          {t('session_timeout_modal_body', {countdown: this.state.timer})}
        </Modal>
      }</Translation>
    );
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `SessionTimeoutModal.componentDidMount()`);
    this.modalTimer();
  }

  componentDidUpdate(prevProps) {
    Logger.log('silly', `SessionTimeoutModal.componentDidUpdate()`);
    if (this.props.authExpires !== prevProps.authExpires) {
      this.modalTimer();
    }
  }

  componentWillUnmount() {
    Logger.log('silly', `SessionTimeoutModal.componentWillUnmount()`);
    clearInterval(this.timeout);
    clearInterval(this.countdownTimer);
  }
}

export default withRouter(SessionTimeoutModal);

Logger.log('silly', `SessionTimeoutModal loaded.`);
