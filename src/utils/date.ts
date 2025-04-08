import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

import config from '../config';
import {logger} from './logger';

dayjs.extend(utc);
dayjs.extend(timezone);

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

export const currentTimeString = () => dayjs().tz(config.LOCAL_TIMEZONE).format(DATE_TIME_FORMAT);

export const parseTime = (timeString: string): Date => {
  try {
    const date = dayjs.tz(timeString, DATE_TIME_FORMAT, config.LOCAL_TIMEZONE);
    return date.toDate();
  } catch {
    logger.error(
      `"${timeString}" Parse Time Error! Use current date and time: ${currentTimeString()}`,
    );
    return new Date();
  }
};

export const stringfyTime = (time: Date) =>
  dayjs(time).tz(config.LOCAL_TIMEZONE).format(DATE_TIME_FORMAT);
