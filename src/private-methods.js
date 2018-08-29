const setTimeListener = require('./set-time-listener');

/**
 * These are the Ticker class private methods.
 * They are called with a ticker instance as their context (`this`).
 */

module.exports = {
	resume,
	runTick,
	setTickAt,
};

const getNow = Date.now;

function resume (now = getNow()) {
	const targetTime = now + this.remainToNextTick;

	setTickAt.call(this, targetTime);

	this.remainToNextTick = 0;
}

function setTickAt (targetTime) {
	this.abort = setTimeListener(targetTime, () => {
		if (this.isRunning) {
			runTick.call(this, targetTime);
		}
	});
}

function runTick (targetTime) {
	this.lastTick = targetTime;

	setTickAt.call(this, targetTime + this.interval);

	this.callback(targetTime);
}
