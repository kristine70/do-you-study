import { createLogger, format, transports } from 'winston';
import Color from 'colors';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import config from '../config';

dayjs.extend(utc);
dayjs.extend(timezone);

const timezoned = () =>
  dayjs().tz(config.LOCAL_TIMEZONE).format(config.DATE_TIME_FORMAT);
const S = (s: unknown) => String(s).trim();

const formatTransports = [
  new transports.Console({ level: 'debug' }),
  new transports.File({
    filename: 'logs/app.log',
    format: format.uncolorize(),
    level: 'debug',
  }),
];
const setColor = (level: string, message: string) => {
  if (level === 'ERROR') return `[${Color.red(level)}] ${Color.red(message)}`;
  if (level === 'DEBUG') return `[${Color.gray(level)}] ${Color.gray(message)}`;
  return `[${Color.blue(level)}] ${message}`;
};

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: timezoned }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${Color.gray(S(timestamp))} ${setColor(level.toUpperCase(), S(message))}`,
    ),
  ),
  transports: formatTransports,
});
