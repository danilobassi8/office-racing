import { describe } from 'node:test';
import { expect, test } from 'vitest';
import { millisecondsToTime, timeInputToMilliseconds } from './utils';

describe('User input (MM:SS:mmm) to miliseconds', () => {
  [
    ['2:00:000', 120000],
    ['2:0:0', 120000],
    ['02:0:0', 120000],
    ['0002:000:000', 120000],
    // with dots
    ['2.00.000', 120000],
    ['2.0.0', 120000],
    ['02.0.0', 120000],
    ['0002.000.000', 120000],
    // mixed
    ['2:00.000', 120000],
    ['2.0:0', 120000],
    ['02:0.0', 120000],
    ['0002:000.000', 120000],
    // real like values
    ['0:0:60', 60],
    ['0:1:0', 1000],
    ['0:10:0', 10000],
    ['1:00:0', 60000],
    ['1:01:030', 30 + 1000 + 60000],
    ['02:25:156', 156 + 25000 + 120000],
    ['4:1:126', 126 + 1000 + 240000],
    ['03:03:456', 456 + 3000 + 180000],
    ['30:3:3', 3 + 3000 + 1800000],
  ].forEach(([input, expected]) =>
    test(`Input ${input} should ouput ${expected} ms`, () => {
      expect(timeInputToMilliseconds(input)).toBe(expected);
    })
  );
});

describe('Milliseconds to MM:SS:mmm', () => {
  [
    ['00:00:060', 60],
    ['00:01:000', 1000],
    ['00:10:000', 10000],
    ['01:00:000', 60000],
    ['01:01:030', 30 + 1000 + 60000],
    ['02:25:156', 156 + 25000 + 120000],
    ['04:01:126', 126 + 1000 + 240000],
    ['03:03:456', 456 + 3000 + 180000],
    ['30:03:003', 3 + 3000 + 1800000],
  ].forEach(([expected, input]) =>
    test(`${input} ms should be translated to ${expected}`, () => {
      expect(millisecondsToTime(input, true)).toBe(expected);
    })
  );
});

describe('Invalid inputs', () => {
  [
    'a:b:c',
    '',
    '200025',
    20.02,
    20_20_200,
    'one.two.three',
    '11/12/13',
    '03:20',
    'a:20:300',
    '30:30:0x',
    '30:200:20',
    '2:30:1000',
    '2:61:107',
    '2:60:107',
  ].forEach((value) =>
    test(`${value} should throw error`, () => expect(() => timeInputToMilliseconds(value)).toThrowError())
  );
});
