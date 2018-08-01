const {
	resume,
	runTick,
	setTickAt,
} = require('./static-methods');

class Ticker {
	constructor (interval, callback, tickOnStart = true) {
		validateArgs(interval, callback);

		this.interval = interval;
		this.callback = callback;
		this.ref = null;
		this.isActive = false;
		this.remainToTick = 0;
		this.tickOnStart = tickOnStart;
		this.lastTick = 0;
	}
	
	start (now = Date.now()) {
		if (this.isActive) return;

		this.isActive = true;

		if (this.remainToTick) { // is paused
			resume.call(this, now);
		}
		else { // fresh start
			if (this.tickOnStart) {
				runTick.call(this, now);
			}
			else {
				const target = now + this.interval;
				setTickAt.call(this, target);
			}
		}
	}

	stop (now = Date.now()) {
		if (!this.isActive) return;

		this.isActive = false;
		
		const fromLastTick = now - this.lastTick;
		
		this.remainToTick = this.interval - fromLastTick;
	}

	reset (now = Date.now()) {
		clearTimeout(this.ref);
		this.ref = null;
		this.remainToTick = 0;
		this.lastTick = 0;
		
		if (this.isActive) {
			this.isActive = false;
			this.start(now);			
		}
	}
}

module.exports = Ticker;

function validateArgs (interval, callback) {
	if (interval < 100) {
		throw new Error('Ticker interval should be at least 100ms');
	}
	
	if (typeof callback !== 'function') {
		throw new Error('Ticker callback nust be a function');
	}
}
