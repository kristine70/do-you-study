import {logger} from '../src/utils/logger';
import {timeString} from '../src/utils/date';

test('timeString Correct', () => {
  expect(timeString());
});

logger.info('test test info');
logger.error('test test error');
logger.debug('test test debug');
console.log(timeString());
