import { MIN_INTERVAL } from './common';

export const CANNOT_START_WITHOUT_INTERVAL = 'Ticker cannot be started without an interval. Call `.setInterval(ms)`.';
export const INVALID_INTERVAL = `Ticker interval should be a number greater than ${MIN_INTERVAL}`;
export const INVALID_TICK_HANDLER = 'Ticker `tickHandler` must be a function';
export const INVALID_TIMEOUT_OBJECT = 'Timeout object should have both `setTimeout` and `clearTimeout` methods.';
