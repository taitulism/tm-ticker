import { INVALID_TIMEOUT_OBJECT } from './errors';
import { TimeoutObject, TimeoutRef, Timestamp } from './types';

const META_TICK = 12;
const HALF_META_TICK = META_TICK / 2;
const TIME_PAD = 2;
const ZERO = 0;

export function createSetTimeListener (timeoutObj: TimeoutObject = window): (
	target: Timestamp,
	callback: VoidFunction
) => VoidFunction {
	validateTimeoutObj(timeoutObj);

	return function setTimeListener (
		target: Timestamp,
		callback: VoidFunction,
		// TODO: ...callbackArgs (like setTimeout's 3rd argument)
	): VoidFunction {
		const timeLeft = target - Date.now();

		// TODO: should use meta tick?
		const msToMetaTick = timeLeft - META_TICK;

		/*
			`ref` value is switching: it starts as the meta tick's timeout ref
			and then switches to hold the "real" tick's timeout ref.
		*/
		let ref = timeoutObj.setTimeout(() => {
			ref = runMetaTick(target, callback, timeoutObj);
		}, msToMetaTick);

		return function clearTimeListener () {
			timeoutObj.clearTimeout(ref);
		};
	};
}


function runMetaTick (
	target:Timestamp,
	callback: VoidFunction,
	timeoutObj: TimeoutObject,
): TimeoutRef {
	const timeLeft = target - Date.now();

	// delay is too great for a timeout. Run callback now.
	if (timeLeft <= TIME_PAD) {
		callback();

		return ZERO;
	}

	const delay = META_TICK - timeLeft;
	const msToRealTick = delay < HALF_META_TICK
		? Math.max(timeLeft - delay, TIME_PAD) // miror the delay with minimum
		: 0;

	return timeoutObj.setTimeout(callback, msToRealTick);
}


function validateTimeoutObj (timeoutObj: TimeoutObject) {
	if (typeof timeoutObj.setTimeout !== 'function' || typeof timeoutObj.clearTimeout !== 'function') {
		throw new Error(INVALID_TIMEOUT_OBJECT);
	}
}
