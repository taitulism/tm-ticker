/** 
	These are the Ticker class private methods.
	They are called with a ticker instance as their context (`this`).
 */
module.exports = {
	resume,
	runTick,
	setTickAt,
};

const Now = Date.now;

const logCahce = [];

function clog (...args) {
	logCahce.push([...args]);
}

function resume (now = Now()) {
	const targetTime = now + this.remainToTick;

	if (this.remainToTick >= 50) {
		setTickAt(this, targetTime);
	}
	else {
		metaTick(this, targetTime, now);
	}
	
	this.remainToTick = 0;
}

function onTimeEvent (target, callback) {
	const now = Now();
	
	// if (now > target) {
	// 	throw new Error('onTimeEvent got a target from the past');
	// }
	
	const timeLeft = target - now;
	
	if (timeLeft <= 3) {
		callback(target);
		return null;
	}

	if (timeLeft <= META_TICK) {
		return setTimeout(() => {
			callback(target);
		}, timeLeft - 3);
	}
	
	return setTimeout(() => {
		metaTick(target, callback);
	}, timeLeft - META_TICK);
}

const META_TICK = 25;
/*
	MetaTick is set to run 25ms before target time.
	Its target is to consider its own delay when calculating the 
	timeout for the target time.
	
	setTimeout(callback, timeLeft - delay)

	timeLeft - delay:
	-----------------
	Miror-like matching the timeout with the delay.

	small delay = small time before target
	large delay = large time before target

	Exceeded delay (more than 12) will result a negative timeout which
	is considered as setTimeout 0:
	
	for example: 
	* - small delay
	^ - large delay

								   -12
					  ┌─────────────┼────────────┐
					  │      ┌──────┼──────┐     │
	timeline>-----25--*--20--^--15--┼--10--^--5--*--0
				(meta)							  (tick)
*/
function metaTick (target, callback) {
	const now = Now();
	const timeLeft = target - now;
	const delay = META_TICK - timeLeft;
	
	return setTimeout(() => {
		callback(target);
	}, timeLeft - delay);
}

function setTickAt (targetTime) {
	this.ref = onTimeEvent(targetTime, (now, diff) => {
		this.isActive && runTick.call(this, targetTime);
	});
}

function runTick (targetTime) {
	this.lastTick = targetTime;

	setTickAt.call(this, targetTime + this.interval);

	this.callback(targetTime);
}
