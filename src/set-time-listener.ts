import { Milliseconds, Timestamp } from './types';
import {getNow, memoize} from './utils';

// TODO: fix type
// https://stackoverflow.com/questions/51040703/what-return-type-should-be-used-for-settimeout-in-typescript
// https://www.designcise.com/web/tutorial/what-is-the-correct-typescript-return-type-for-javascripts-settimeout-function
type TimeoutRef = ReturnType<typeof setTimeout> | VoidFunction;

// Default values
const META_TICK = 12;
const TIME_MARGIN = 2;
const ZERO = 0;

// Negative value means run the callback now (synchronously).
const TIME_PASSED = -1;

/* eslint-disable no-magic-numbers */
const META_THRESHOLD = (META_TICK * 2) + TIME_MARGIN; // 26
const MIN_TIME_LEFT = (META_TICK / 4); // 3
/* eslint-enable no-magic-numbers */

const noop: VoidFunction = () => {};

const calcTimeoutMs = memoize((timeLeft: Milliseconds): Milliseconds => {
	// A great delay
	if (timeLeft <= MIN_TIME_LEFT) {
		return TIME_PASSED;
	}

	const delay = META_TICK - timeLeft;

	if (delay <= TIME_MARGIN) {
		return timeLeft - TIME_MARGIN;
	}

	// Miror the delay
	return timeLeft - delay;
});

export function setTimeListener (target: Timestamp, callback: VoidFunction): VoidFunction | void{
	let ref: TimeoutRef;
	const timeLeft = target - getNow();

	// Using `setTimeListener` for such a short time period is an overhead.
	if (timeLeft <= META_THRESHOLD) {
		if (timeLeft <= TIME_MARGIN) {
			ref = noop;

			// No time for setTimeout. Run callback now.
			return callback();
		}

		// No time for a metaTick. Just pad and run.
		const ms = timeLeft - TIME_MARGIN;

		ref = setTimeout(() => {
			callback();
		}, ms);
	}
	else {
		ref = setMetaTick(target, callback, timeLeft);
	}

	return function clearTimeListener () {
		if (typeof ref === 'function') {
			ref();
		}
		else {
			clearTimeout(ref);
		}
	};
}

function setMetaTick (target: Timestamp, callback: VoidFunction, timeLeft: Milliseconds) {
	let ref: TimeoutRef;
	const ms = timeLeft - META_TICK;

	ref = setTimeout(() => {
		ref = runMetaTick(target, callback);
	}, ms);

	return function clearTimeListener () {
		clearTimeout(ref);
	};
}

function runMetaTick (target:Timestamp, callback: VoidFunction): TimeoutRef {
	const timeLeft = target - getNow();
	const ms = calcTimeoutMs(timeLeft);

	if (ms < ZERO) {
		callback();
		return noop;
	}

	// TODO: This setTimeout cannot be cleared (time scope)
	return setTimeout(() => {
		callback();
	}, ms);
}
