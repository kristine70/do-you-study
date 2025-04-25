import {logger} from '../src/utils/logger';
import {currentTimeString, parseTime, stringfyTime, beforeXdays} from '../src/utils/date';

function formatToIsoDateTime(input: string) {
  const date = new Date(input);
  const pad = (n: number) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

test('Stringify Times', () => {
  const now = new Date();
  // use for update db last voice time
  expect(stringfyTime(now)).toEqual(
    formatToIsoDateTime(now.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})),
  );
  expect(currentTimeString()).toEqual(
    formatToIsoDateTime(new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})),
  );
});

test('Parse Time', () => {
  const timeString = '2025-04-07 12:21:42';
  // use for send messages
  expect(stringfyTime(parseTime(timeString))).toEqual(timeString);
  expect(stringfyTime(parseTime('wer dfasdf'))).toEqual(currentTimeString());
});

test('beforeXdays', () => {
  expect(beforeXdays(parseTime('2025-04-18 12:21:42'), 7)).toEqual(true);
});

logger.info('test test info');
logger.error('test test error');
logger.debug('test test debug');
console.log(currentTimeString());
