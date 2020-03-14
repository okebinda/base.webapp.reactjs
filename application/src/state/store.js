import Config from '../Config';
import Logger from '../lib/Logger';

const store = (Config.get('ENVIRONMENT') === 'production')
  ? require('../state/store.prod.js').default
  : require('../state/store.dev.js').default;

export default store;

Logger.log('silly', `store loaded.`);
