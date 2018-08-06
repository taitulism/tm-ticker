const config = require('set-time-listener');

const setTimeListener = config(true);

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

function setTickAt (targetTime) {
	this.abort = setTimeListener(targetTime, (target) => {
		this.isActive && runTick.call(this, target);
	});
}

function runTick (targetTime) {
	this.lastTick = targetTime;

	setTickAt.call(this, targetTime + this.interval);

	this.callback(targetTime);
}
