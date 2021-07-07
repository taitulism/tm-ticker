/* eslint-disable max-lines-per-function */

import { noop } from './common';
import { INVALID_TIMEOUT_OBJECT } from './errors';
import { Milliseconds, TimeoutObject, TimeoutRef, Timestamp } from './types';

// TODO: better type
// https://stackoverflow.com/questions/51040703/what-return-type-should-be-used-for-settimeout-in-typescript
// https://www.designcise.com/web/tutorial/what-is-the-correct-typescript-return-type-for-javascripts-settimeout-function
// Type TimeoutRef = ReturnType<typeof setTimeout> | VoidFunction;
type ClearTimeoutRef = TimeoutRef | VoidFunction;

// Default values
const META_TICK = 12;
const TIME_MARGIN = 2;
const ZERO = 0;

// Negative value means run the callback now (synchronously).
const TIME_PASSED = -1;

// TODO: eslint
/* eslint-disable no-magic-numbers */
const META_THRESHOLD = (META_TICK * 2) + TIME_MARGIN; // 26
const MIN_TIME_LEFT = (META_TICK / 4); // 3
/* eslint-enable no-magic-numbers */

const calcTimeoutMs = (timeLeft: Milliseconds): Milliseconds => {
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
};


function validateTimeoutObj (timeoutObj: TimeoutObject) {
	// eslint-disable-next-line max-len
	if (typeof timeoutObj.setTimeout !== 'function' || typeof timeoutObj.clearTimeout !== 'function') {
		throw new Error(INVALID_TIMEOUT_OBJECT);
	}
}

export function createSetTimeListener (timeoutObj: TimeoutObject = window): (
	target: Timestamp,
	callback: VoidFunction
) => VoidFunction | void {
	validateTimeoutObj(timeoutObj);

	function setMetaTick (target: Timestamp, callback: VoidFunction, timeLeft: Milliseconds) {
		let ref: ClearTimeoutRef;
		const ms = timeLeft - META_TICK;

		ref = timeoutObj.setTimeout(() => {
			ref = runMetaTick(target, callback);
		}, ms);

		return function clearTimeListener () {
			timeoutObj.clearTimeout(ref as number);
		};
	}

	function runMetaTick (target:Timestamp, callback: VoidFunction): ClearTimeoutRef {
		const timeLeft = target - Date.now();
		const ms = calcTimeoutMs(timeLeft);

		if (ms < ZERO) {
			callback();

			return noop;
		}

		// TODO: This setTimeout cannot be cleared (time scope)
		return timeoutObj.setTimeout(() => {
			callback();
		}, ms);
	}

	return function setTimeListener (
		target: Timestamp,
		callback: VoidFunction
	): VoidFunction | void {
		let ref: ClearTimeoutRef;
		const timeLeft = target - Date.now();

		// Using `setTimeListener` for such a short time period is an overhead.
		if (timeLeft <= META_THRESHOLD) {
			if (timeLeft <= TIME_MARGIN) {
				ref = noop;

				// No time for setTimeout. Run callback now.
				return callback();
			}

			// No time for a metaTick. Just pad and run.
			const ms = timeLeft - TIME_MARGIN;

			ref = timeoutObj.setTimeout(() => {
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
				timeoutObj.clearTimeout(ref);
			}
		};
	};
}
