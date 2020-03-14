import {message} from 'antd';

import Config from '../../../../Config';
import Logger from '../../../../lib/Logger';

class MessageWrapper {

  constructor() {
    Logger.log('debug', `MessageWrapper.constructor()`);
    this.events = {};
  }

  success(content, duration=null, onClose=null) {
    Logger.log('debug', `MessageWrapper.success(${content}, ${duration}, ###)`);
    duration = duration || Config.get('DEFAULT_MESSAGE_TIMEOUT');
    message.success(content, duration, onClose);
  }

  error(content, duration=null, onClose=null) {
    Logger.log('debug', `MessageWrapper.error(${content}, ${duration}, ###)`);
    duration = duration || Config.get('DEFAULT_MESSAGE_TIMEOUT');
    message.error(content, duration, onClose);
  }

  info(content, duration=null, onClose=null) {
    Logger.log('debug', `MessageWrapper.info(${content}, ${duration}, ###)`);
    duration = duration || Config.get('DEFAULT_MESSAGE_TIMEOUT');
    message.info(content, duration, onClose);
  }

  warning(content, duration=null, onClose=null) {
    Logger.log('debug', `MessageWrapper.warning(${content}, ${duration}, ###)`);
    duration = duration || Config.get('DEFAULT_MESSAGE_TIMEOUT');
    message.warning(content, duration, onClose);
  }

  warn(content, duration=null, onClose=null) {
    Logger.log('debug', `MessageWrapper.warn(${content}, ${duration}, ###)`);
    duration = duration || Config.get('DEFAULT_MESSAGE_TIMEOUT');
    message.warn(content, duration, onClose);
  }

  loading(content, duration=null, onClose=null) {
    Logger.log('debug', `MessageWrapper.loading(${content}, ${duration}, ###)`);
    duration = duration || Config.get('DEFAULT_MESSAGE_TIMEOUT');
    message.loading(content, duration, onClose);
  }

  open(config) {
    Logger.log('debug', `MessageWrapper.open(${config})`);
    message.open(config);
  }

  config(options) {
    Logger.log('debug', `MessageWrapper.config(${options})`);
    message.config(options);
  }

  destroy() {
    Logger.log('debug', `MessageWrapper.destroy()`);
    message.destroy();
  }  
}

const messageWrapper = new MessageWrapper();
export default messageWrapper;

Logger.log('silly', `MessageWrapper loaded.`);
