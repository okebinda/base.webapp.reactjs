import React, {Component} from 'react';
import {Translation} from 'react-i18next';
import {Button, Modal} from 'antd';

import Format from '../../../../../lib/Format';
import Logger from '../../../../../lib/Logger';

class TermsOfServiceModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    Logger.log('debug', `TermsOfServiceModal.toggle()`);
    this.setState(prevState => ({
      visible: !prevState.visible
    }));
  }

  render() {
    return (
      <Translation>{(t) => 
        <div>

          <div className="link-terms-of-service">
            <Button type="link" onClick={this.toggle}>{t('terms_of_service_link')}</Button>
          </div>

          <Modal 
            title={t('terms_of_service_title') + ', ' + Format.date(this.props.publishDate)}
            visible={this.state.visible}
            onCancel={this.toggle} className={this.props.className}
            footer={[
              <Button 
                key="close"
                type="primary"
                onClick={this.toggle}>{t('action_close')}</Button>
            ]}
          >
            {this.props.text}
          </Modal>

        </div>
      }</Translation>
    );
  }

  /* LIFECYCLE EVENTS */

  componentDidMount() {
    Logger.log('silly', `TermsOfServiceModal.componentDidMount()`);
    this.props.loadTermsOfServiceCurrent();
  }

  componentDidUpdate() {
    Logger.log('silly', `TermsOfServiceModal.componentDidUpdate()`);
  }

  componentWillUnmount() {
    Logger.log('silly', `TermsOfServiceModal.componentWillUnmount()`);
  }
}

export default TermsOfServiceModal;

Logger.log('silly', `TermsOfServiceModal loaded.`);
