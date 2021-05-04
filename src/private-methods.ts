import { Timestamp } from './types';
import { setTimeListener } from './set-time-listener';
import { getNow } from './utils';
import type Ticker from './Ticker';

export function resume (ticker: Ticker, now: Timestamp = getNow()) {
	setNextTick(ticker, now + ticker.timeLeft);

	ticker.timeLeft = 0;
}

export function setNextTick (ticker: Ticker, nextTarget: Timestamp) {
	ticker.nextTick = nextTarget;

	ticker.abortFn = setTimeListener(nextTarget, () => {
		if (ticker.isRunning) {
			runTick(ticker, nextTarget);
		}
	});
}

export function runTick (ticker: Ticker, currentTarget: Timestamp) {
	setNextTick(ticker, currentTarget + ticker.interval);

	ticker.callback && ticker.callback();
}

export function abort (ticker: Ticker) {
	if (ticker.abortFn) {
		ticker.abortFn();
		ticker.abortFn = undefined;
	}
}
