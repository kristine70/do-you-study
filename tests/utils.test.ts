import {logger} from '../src/utils/logger';
import {currentTimeString, parseTime, stringfyTime, beforeXdays} from '../src/utils/date';

test('[Date Utils] Parse Time String', () => {
  expect(parseTime('2025-04-07 12:21:42')).toEqual(new Date('2025-04-07 12:21:42'));
  expect(parseTime('wer dfasdf')).toEqual(new Date());
  expect(beforeXdays(parseTime('2025-04-17 12:21:42'), 7)).toEqual(true);
  expect(stringfyTime(new Date('2025-04-07 22:10:14'))).toEqual('2025-04-07 22:10:14');
});

logger.info('test test info');
logger.error('test test error');
logger.debug('test test debug');
console.log(currentTimeString());
