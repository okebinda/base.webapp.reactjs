import winston from 'winston';

import Config from '../Config';

// initialize winston logger
const Logger = winston.createLogger({
  level: Config.get('LOG_LEVEL', 'error'), // error, warn, info, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({silent: process.env.NODE_ENV === 'test' ? true : false}),
  ]
});

export default Logger;

Logger.log('silly', `Logger loaded.`);
