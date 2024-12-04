import { createLogger, format, transports } from 'winston';
import Color from 'colors';

const timestampFormat = { format: 'YYYY-MM-DD HH:mm:ss' };
const formatTransports = [
  new transports.Console(),
  new transports.File({
    filename: 'logs/app.log',
    format: format.uncolorize(),
  }),
];
const setColor = (level: string) => {
  if (level === 'ERROR') return Color.red(level);
  else return Color.blue(level);
};

export const logger = createLogger({
  format: format.combine(
    format.timestamp(timestampFormat),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${setColor(level.toUpperCase())}]: ${message}`,
    ),
  ),
  transports: formatTransports,
});
