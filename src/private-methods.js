const setTimeListener = require('./set-time-listener');
const {getNow} = require('./common');

/**
 * These are the Ticker class private methods.
 * They are called with a ticker instance as their context (`this`).
 */

module.exports = {
	resume,
	runTick,
	setTickAt,
};

function resume (now = getNow()) {
	this.nextTick = now + this.timeLeft;

	setTickAt.call(this, this.nextTick);

	this.timeLeft = 0;
}

function setTickAt (target) {
	this.abort = setTimeListener(target, () => {
		if (this.isRunning) {
			runTick.call(this, target);
		}
	});
}

function runTick (target) {
	this.nextTick = target + this.interval;

	setTickAt.call(this, this.nextTick);

	this.callback && this.callback();
}
