import { createLogger, format, transports } from 'winston';
import Color from 'colors';

const formatTransports = [
  new transports.Console(),
  new transports.File({
    filename: 'logs/app.log',
    format: format.uncolorize(),
  }),
];
const setColor = (level: string) =>
  level === 'ERROR' ? Color.red(level) : Color.blue(level);

export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${setColor(level.toUpperCase())}]: ${message}`,
    ),
  ),
  transports: formatTransports,
});
