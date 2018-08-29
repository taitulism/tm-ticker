const {
	resume,
	runTick,
	setTickAt,
} = require('./private-methods');

const MIN_INTERVAL = 50;

class Ticker {
	constructor (interval, callback, tickOnStart = true) {
		validateArgs(interval, callback);

		this.interval = interval;
		this.callback = callback;
		this.abort = null;
		this.isRunning = false;
		this.remainToNextTick = 0;
		this.shouldTickOnStart = tickOnStart;
		this.lastTick = 0;
	}

	get isPaused () {
		// Stopped but not reseted
		return this.remainToNextTick !== 0;
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
			const target = now + this.interval;

			setTickAt.call(this, target);
		}
	}

	stop (now = Date.now()) {
		if (!this.isRunning) return;

		this.isRunning = false;

		const fromLastTick = now - this.lastTick;

		this.remainToNextTick = this.interval - fromLastTick;
	}

	reset (now = Date.now()) {
		this.abort();
		this.abort = null;
		this.remainToNextTick = 0;
		this.lastTick = 0;

		if (this.isRunning) {
			this.isRunning = false;
			this.start(now);
		}
	}
}

module.exports = Ticker;

function validateArgs (interval, callback) {
	if (typeof interval !== 'number' || interval < MIN_INTERVAL) {
		throw new Error('Ticker interval should be at least 50ms');
	}

	if (typeof callback !== 'function') {
		throw new Error('Ticker callback nust be a function');
	}
}
