import { ITicker, Timestamp } from './types';
import {setTimeListener} from './set-time-listener';
import {getNow} from './common';

/**
 * These are the Ticker class private methods.
 * They are called with a ticker instance as their context (`this`).
 */

export function resume (this: ITicker, now: Timestamp = getNow()) {
	this.nextTick = now + this.timeLeft;

	setTickAt.call(this, this.nextTick);

	this.timeLeft = 0;
}

export function setTickAt (this: ITicker, target: Timestamp) {
	this.abortFn = setTimeListener(target, () => {
		if (this.isRunning) {
			runTick.call(this, target);
		}
	});
}

export function runTick (this: ITicker, target: Timestamp) {
	this.nextTick = target + this.interval;

	setTickAt.call(this, this.nextTick);

	this.callback && this.callback();
}

export function abort (this: ITicker) {
	if (this.abortFn) {
		this.abortFn();
		this.abortFn = null;
	}
}
