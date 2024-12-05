import { createLogger, format, transports } from 'winston';
import Color from 'colors';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import config from '../config';

dayjs.extend(utc);
dayjs.extend(timezone);

const timezoned = () => {
  return dayjs().tz(config.LOCAL_TIMEZONE).format(config.DATE_TIME_FORMAT); // Format as ISO string by default
};
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
    format.timestamp({ format: timezoned }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${setColor(level.toUpperCase())}]: ${message}`,
    ),
  ),
  transports: formatTransports,
});
