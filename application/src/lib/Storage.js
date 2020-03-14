import Logger from './Logger';

class Storage {

  constructor() {
    Logger.log('debug', `Storage.constructor()`);
    this.store = this._newStore();
    this.localStorage = global.localStorage || null;
    this.sessionStorage = global.sessionStorage || null;
  }

  get(store, key, def=null) {
    Logger.log('debug', `Storage.get(${store}, ${key}, ${def})`);
    if ('local' === store && this.localStorage) {
      return this.localStorage.getItem(key)
        ? JSON.parse(this.localStorage.getItem(key))
        : def;
    } else if ('session' === store && this.sessionStorage) {
      return this.sessionStorage.getItem(key)
        ? JSON.parse(this.sessionStorage.getItem(key))
        : def;
    }
    return store in this.store && key in this.store[store]
      ? JSON.parse(this.store[store][key])
      : def;
  }

  set(store, key, data) {
    Logger.log('debug', `Storage.set(${store}, ${key}, ${data})`);
    data = typeof data === 'undefined' ? null : data;
    if ('local' === store && this.localStorage) {
      this.localStorage.setItem(key, JSON.stringify(data));
    } else if ('session' === store && this.sessionStorage) {
      this.sessionStorage.setItem(key, JSON.stringify(data));
    } else if (store in this.store) {
      this.store[store][key] = JSON.stringify(data);
    }
  }

  remove(store, key) {
    Logger.log('debug', `Storage.remove(${store}, ${key})`);
    if ('local' === store && this.localStorage) {
      this.localStorage.removeItem(key);
    } else if ('session' === store && this.sessionStorage) {
      this.sessionStorage.removeItem(key);
    } else if (store in this.store) {
      delete this.store[store][key];
    }
  }

  clear(store=null) {
    Logger.log('debug', `Storage.clear(${store})`);
    if (!store && this.localStorage && this.sessionStorage) {
      this.localStorage.clear();
      this.sessionStorage.clear();
    } else if ('local' === store && this.localStorage) {
      this.localStorage.clear();
    } else if ('session' === store && this.sessionStorage) {
      this.sessionStorage.clear();
    }
    this.store = this._newStore(store);
  }

  _newStore(store=null) {
    Logger.log('debug', `Storage._newStore(${store})`);
    if ('local' === store) {
      return {
        'local': {},
        'session': this.store['session']
      }
    } else if ('session' === store) {
      return {
        'local': this.store['local'],
        'session': {}
      }
    }
    return {
      'local': {},
      'session': {}
    };
  }
}

const storage = new Storage();
export default storage;

Logger.log('silly', `Storage loaded.`);
