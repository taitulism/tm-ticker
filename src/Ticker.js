const {
	resume,
	runTick,
	setTickAt,
} = require('./private-methods');

const MIN_INTERVAL = 50;

class Ticker {
	constructor (interval, callback, tickOnStart = true) {
		interval && this.setInterval(interval);
		callback && this.setCallback(callback);

		this.abort = null;
		this.isRunning = false;
		this._timeLeft = 0;
		this.shouldTickOnStart = tickOnStart;
		this.nextTick = 0;
	}

	get isPaused () {
		// Stopped but not reseted
		const isItPaused = this._timeLeft !== 0;

		return isItPaused;
	}

	get timeLeft () {
		if (this.isRunning) {
			return this.getTimeLeft();
		}

		return this._timeLeft;
	}

	set timeLeft (val) {
		this._timeLeft = val;
	}

	getTimeLeft (now = Date.now()) {
		return this.nextTick - now;
	}

	setInterval (interval) {
		validateInterval(interval);

		this.interval = interval;
	}

	setCallback (fn) {
		validateCallback(fn);

		this.callback = fn;
	}

	setTickOnStart (bool) {
		this.shouldTickOnStart = Boolean(bool);
	}

	set (interval, fn) {
		this.setInterval(interval);
		this.setCallback(fn);
	}

	start (now = Date.now()) {
		if (this.isRunning) return;

		this.isRunning = true;

		if (this.isPaused) {
			resume.call(this, now);

			return;
		}

		if (this.shouldTickOnStart) {
			runTick.call(this, now);
		}
		else {
			this.nextTick = now + this.interval;

			setTickAt.call(this, this.nextTick);
		}
	}

	stop (now = Date.now()) {
		if (!this.isRunning) return;

		this.isRunning = false;

		this.abort && this.abort();

		this.timeLeft = this.getTimeLeft(now);
	}

	reset (now = Date.now()) {
		this.abort && this.abort();

		this.timeLeft = 0;
		this.nextTick = 0;

		if (this.isRunning) {
			this.isRunning = false;
			this.start(now);
		}
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
