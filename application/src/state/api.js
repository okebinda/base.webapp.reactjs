import axios from 'axios';
import {Map} from 'immutable';
// import {decode, encode} from 'base-64'

import Auth from '../lib/Auth';
import Logger from '../lib/Logger';
import Config from '../Config';

// polyfill for axios
// if (!global.btoa) {
//   global.btoa = encode;
// }

// if (!global.atob) {
//   global.atob = decode;
// }

class API {

  constructor(config, axios) {
    Logger.log('debug', `API.constructor(###, ###)`);

    // config props
    this.environment = config.get('ENVIRONMENT');
    this.base_url = config.get('API_BASE_URL');
    this.app_key = config.get('API_APP_KEY');

    // internal props
    this.axios = axios;
    this.authToken = null;
    this.authExpires = null;
    this.destroySession = null;
  }

  setAuthToken(authToken) {
    this.authToken = authToken;
  }

  setAuthExpires(authExpires) {
    this.authExpires = authExpires;
  }

  setDestroySession(destroySession) {
    this.destroySession = destroySession;
  }

  // destroy session data and redirect to auth screen
  _logout = () => {
    Logger.log('debug', `API._logout()`);
    this.destroySession();
  }

  // get authentication token
  _getAuthToken() {
    Logger.log('debug', `API._getAuthToken()`);
    const authToken = this.authToken;
    const authExpires = this.authExpires;
    return Auth.isAuthTokenValid(authToken, authExpires) ? authToken : false;
  }

  // get request headers
  _getRequestHeaders(validateStatus=null, authenticate=true) {
    Logger.log('debug', `API._getRequestHeaders(${validateStatus}, ${authenticate})`);

    const authToken = this._getAuthToken();
    if (authenticate && !authToken) {
      this._logout();
      return false;
    }
    const authConfig = authToken
      ? {"auth": {"username": authToken}}
      : {};
    const vaildateStatusConfig = validateStatus
      ? {"validateStatus": (status) => status < validateStatus}
      : {};
    return {...authConfig, ...vaildateStatusConfig};
  }

  // get full URI for an API endpoint
  _getUri(path) {
    Logger.log('debug', `API._getUri(${path})`);
    return this.base_url + path + (path.includes('?') ? '&' : '?') + 'app_key=' + this.app_key;
  }

  // generic API call helper
  async _callApi(method, path, payload=null, authenticate=true) {
    Logger.log('debug', `API._callApi(###, ${path}, ###, ${authenticate})`, payload);

    // get headers and check authentication token
    const requestHeaders = this._getRequestHeaders(500, authenticate);
    if (false === requestHeaders) {
      return Map({'status': 401, 'data': {'error': `Not Authenticated`}});
    }

    if (payload) {

      // call API with payload
      return await method(path, payload, requestHeaders)
        .then(async function(response) {
          Logger.log('verbose', `API Response:`, response);
          if (response.status === 401) {
            this._logout();
          }
          return Map(response);
        })
        .catch(function(error) {
          Logger.log('error', `${error}`);
          return Map({'status': 500, 'data': {'error': `${error}`}});
        });

    } else {

      // call API without payload
      return await method(path, requestHeaders)
        .then(async function(response) {
          Logger.log('verbose', `API Response:`, response);
          if (response.status === 401) {
            this._logout();
          }
          return Map(response);
        })
        .catch(function(error) {
          Logger.log('error', `${error}`);
          return Map({'status': 500, 'data': {'error': `${error}`}});
        });
    }
  }

  // GET method
  async GET(path, authenticate=true) {
    Logger.log('debug', `API.GET(${path}, ${authenticate})`);
    return await this._callApi(this.axios.get, path, null, authenticate);
  }

  // POST method
  async POST(path, payload, authenticate=true) {
    Logger.log('debug', `API.POST(${path}, ###, ${authenticate})`, payload);
    return await this._callApi(this.axios.post, path, payload, authenticate);
  }

  // PUT method
  async PUT(path, payload, authenticate=true) {
    Logger.log('debug', `API.PUT(${path}, ###, ${authenticate})`, payload);
    return await this._callApi(this.axios.put, path, payload, authenticate);
  }

  // DELETE method
  async DELETE(path, authenticate=true) {
    Logger.log('debug', `API.DELETE(${path}, ${authenticate})`);
    return await this._callApi(this.axios.delete, path, null, authenticate);
  }

  // GET /token
  async getToken(username, password) {
    Logger.log('debug', `API.getToken(###, ###)`);
    
    // prep credentials header config
    const authConfig = {
      "auth": {
        "username": username,
        "password": password
      },
      "validateStatus": function (status) {
        return status < 500;
      }
    }

    // call API
    const output = await this.axios.get(this._getUri(`/token`), authConfig)
      .then(async function(response) {
        Logger.log('verbose', `API Response:`, response);
        return Map(response);
      })
      .catch(function(error) {
        Logger.log('error', `${error}`);
        return Map({'status': 500, 'data': {'error': `${error}`}});
      });

    return output;
  }

  // POST /user_account/step1
  async postUserAccountStep1(payload) {
    Logger.log('debug', `API.postUserAccountStep1(###)`, payload);
    return await this.POST(this._getUri(`/user_account/step1`), payload, false);
  }

  // POST /user_account/step2
  async postUserAccountStep2(payload) {
    Logger.log('debug', `API.postUserAccountStep2(###)`, payload);
    return await this.POST(this._getUri(`/user_account/step2`), payload);
  }

  // GET /user_account
  async getUserAccount() {
    Logger.log('debug', `API.getUserAccount()`);
    return await this.GET(this._getUri(`/user_account`));
  }

  // PUT /user_account
  async putUserAccount(payload) {
    Logger.log('debug', `API.putUserAccount(###)`, payload);
    return await this.PUT(this._getUri(`/user_account`), payload);
  }

  // POST /password/request-reset-code
  async postPasswordRequestResetCode(payload) {
    Logger.log('debug', `API.postPasswordRequestResetCode(###)`);
    return await this.POST(this._getUri(`/password/request-reset-code`), payload, false);
  }

   // PUT /password/reset
   async putPasswordReset(payload) {
    Logger.log('debug', `API.putPasswordReset(###)`);
    return await this.PUT(this._getUri(`/password/reset`), payload, false);
  }

  // PUT /user_account/password
  async putUserAccountPassword(payload) {
    Logger.log('debug', `API.putUserAccountPassword(###)`);
    return await this.PUT(this._getUri(`/user_account/password`), payload);
  }

  // GET /terms_of_service/current
  async getTermsOfServiceCurrent() {
    Logger.log('debug', `API.getTermsOfServiceCurrent()`);
    return await this.GET(this._getUri(`/terms_of_service/current`), false);
  }
}

const api = new API(Config, axios);
export default api;

Logger.log('silly', `API loaded.`);
