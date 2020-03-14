import storage from './Storage';
import Logger from './Logger';
import Config from '../Config';

class Auth {

  constructor(storageType='session') {
    Logger.log('debug', `Auth.constructor(${storageType})`);
    this.storageType = storageType;
    this.storage = storage;
  }

  setStorageType(storageType) {
    Logger.log('debug', `Auth.setStorageType(${storageType})`);
    this.storageType = storageType;
  }

  saveSession(authToken, authExpiration, authExpires, userId, username) {
    Logger.log('info', `Authentication success. User: ${userId}`);
    this.storage.set(this.storageType, 'authToken', authToken);
    this.storage.set(this.storageType, 'authExpiration', authExpiration);
    this.storage.set(this.storageType, 'authExpires', authExpires);
    this.storage.set(this.storageType, 'userId', userId);
    this.storage.set(this.storageType, 'username', username);
  }

  getSession() {
    Logger.log('debug', `Auth.getSession()`);
    return {
      authToken: this.storage.get(this.storageType, 'authToken'),
      authExpiration: this.storage.get(this.storageType, 'authExpiration'),
      authExpires: this.storage.get(this.storageType, 'authExpires'),
      userId: this.storage.get(this.storageType, 'userId'),
      username: this.storage.get(this.storageType, 'username')
    }
  }

  deleteSession() {
    Logger.log('debug', `Auth.deleteSession()`);
    this.storage.remove(this.storageType, 'authToken');
    this.storage.remove(this.storageType, 'userId');
    this.storage.remove(this.storageType, 'username');
    this.storage.remove(this.storageType, 'authExpiration');
    this.storage.remove(this.storageType, 'authExpires');
  }

  isAuthTokenValid(authToken, authExpires) {
    Logger.log('debug', `Auth.isAuthTokenValid(###, ###)`);
    return authToken && authExpires && parseInt(authExpires) - 60 > Math.round(new Date().getTime()/1000);
  }
}

function findStorageType() {
  if (storage.get('session', 'authToken')) {
    return 'session';
  } else if (storage.get('local', 'authToken')) {
    return 'local';
  }
  return Config.get('DEFAULT_AUTH_STORAGE');
}

const auth = new Auth(findStorageType());
export default auth;

Logger.log('silly', `Auth loaded.`);
