import winston from 'winston';
import Config from './config';

export default winston.createLogger({
  level: Config.get('log_level'),
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
