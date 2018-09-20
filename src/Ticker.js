const {
	resume,
	runTick,
	setTickAt,
	abort,
} = require('./private-methods');

const {getNow} = require('./common');

const MIN_INTERVAL = 50;

class Ticker {
	constructor (interval, callback, tickOnStart = true) {
		interval && this.setInterval(interval);
		callback && this.setCallback(callback);

		this.abort = null;
		this.isRunning = false;
		this.tickOnStart = tickOnStart;
		this.timeLeft = 0;
		this.nextTick = 0;
	}

	getTimeLeft (now = getNow()) {
		if (this.isRunning) {
			return this.nextTick - now;
		}

		return this.timeLeft;
	}

	setInterval (interval) {
		validateInterval(interval);

		this.interval = interval;

		return this;
	}

	setCallback (fn) {
		validateCallback(fn);

		this.callback = fn;

		return this;
	}

	set (interval, fn) {
		this.setInterval(interval);
		this.setCallback(fn);

		return this;
	}

	start (now = getNow()) {
		if (this.isRunning) return this;

		this.isRunning = true;

		if (this.timeLeft) {
			resume.call(this, now);

			return this;
		}

		if (this.tickOnStart) {
			runTick.call(this, now);
		}
		else {
			this.nextTick = now + this.interval;

			setTickAt.call(this, this.nextTick);
		}

		return this;
	}

	stop (now = getNow()) {
		if (!this.isRunning) return this;

		this.isRunning = false;

		abort.call(this);

		this.timeLeft = this.nextTick - now;

		return this;
	}

	reset (now = getNow()) {
		abort.call(this);

		this.timeLeft = 0;
		this.nextTick = 0;

		if (this.isRunning) {
			this.isRunning = false;
			this.start(now);
		}

		return this;
	}

	destroy () {
		this.stop();
		this.reset();

		this.abort = null;
		this.callback = null;
	}
}

module.exports = Ticker;

function validateInterval (interval) {
	if (interval && (typeof interval !== 'number' || interval < MIN_INTERVAL)) {
		throw new Error('Ticker interval should be a number greater than 50');
	}
}

function validateCallback (callback) {
	if (callback && typeof callback !== 'function') {
		throw new Error('Ticker callback must be a function');
	}
}
