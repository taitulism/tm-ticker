import { Timestamp } from './types';
import {setTimeListener} from './set-time-listener';
import {getNow} from './common';
import type { Ticker } from './Ticker';

/**
 * These are the Ticker class private methods.
 * They are called with a ticker instance as their context (`this`).
 *
 */


// TODO: dont use `this` here. pass a ticker instance instead

export function resume (this: Ticker, now: Timestamp = getNow()) {
	this.nextTick = now + this.timeLeft;

	setTickAt.call(this, this.nextTick);

	this.timeLeft = 0;
}

export function setTickAt (this: Ticker, target: Timestamp) {
	this.abortFn = setTimeListener(target, () => {
		if (this.isRunning) {
			runTick.call(this, target);
		}
	});
}

export function runTick (this: Ticker, target: Timestamp) {
	this.nextTick = target + this.interval;

	setTickAt.call(this, this.nextTick);

	this.callback && this.callback();
}

export function abort (this: Ticker) {
	if (this.abortFn) {
		this.abortFn();
		this.abortFn = undefined;
	}
}
