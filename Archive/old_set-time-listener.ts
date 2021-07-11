/* eslint-disable */
// @ts-nocheck

const META_TICK = 12;
const TIME_PAD = 2;

const META_TICK_THRESHOLD = (META_TICK * 2) + TIME_PAD; // 26
const MIN_TIME_LEFT = (META_TICK / 4); // 3

const shouldUseMetaTick = (timeLeft: Milliseconds): boolean => timeLeft >= META_TICK_THRESHOLD;
const shouldPad = (timeLeft: Milliseconds): boolean => timeLeft >= PAD_THRESHOLD;

return function setTimeListener (
	target: Timestamp,
	callback: VoidFunction
): VoidFunction {
	const timeLeft = target - Date.now();
	let ref: ClearTimeoutRef;

	/*
		If there's enough time - set a meta tick
		Otherwise, using `setTimeListener` for such a short time period is an overhead.
	*/

	if (shouldUseMetaTick(timeLeft)) {
		ref = setMetaTick(target, callback, timeLeft);
	}
	else if (shouldPad(timeLeft)) {
		// No time for a metaTick. Just pad and run.
		const ms = timeLeft - TIME_PAD;

		ref = timeoutObj.setTimeout(() => {
			callback();
		}, ms);
	}
	else {
		// No time for setTimeout, run callback now.
		callback();

		ref = noop;
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
