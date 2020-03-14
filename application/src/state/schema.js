import {schema as s} from 'normalizr';

import Logger from '../lib/Logger';

// Examples:
// const country = new s.Entity('countries');
// const region = new s.Entity('regions');
// const role = new s.Entity('roles');
// const user = new s.Entity('users', {
//   roles: [role]
// });

const schema = {
  // country: country,
  // region: region,
  // user: user,
  // role: role,
};

export {schema};

Logger.log('silly', `schema loaded.`);
