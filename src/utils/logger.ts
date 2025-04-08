import {createLogger, format, transports} from 'winston';
import {timeString} from './date';

const S = (s: unknown) => String(s).trim();

const formatTransports = [
  new transports.Console({level: 'debug'}),
  new transports.File({
    filename: 'logs/app.log',
    level: 'debug',
  }),
];

export const logger = createLogger({
  format: format.combine(
    format.timestamp({format: timeString}),
    format.printf(
      ({timestamp, level, message}) =>
        `${timestamp as string} [${level.toUpperCase()}] ${S(message)}`,
    ),
  ),
  transports: formatTransports,
});
