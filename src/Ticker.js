const {
	resume,
	runTick,
} = require('./static-methods');

class Ticker {
	constructor (interval, callback) {
		validateArgs(interval, callback);

		this.interval = interval;
		this.callback = callback;
		this.ref = null;
		this.isActive = false;
		this.remainToTick = 0;
	}
	
	start (now = Date.now()) {
		if (this.isActive) return;
		console.log('start', now);

		this.isActive = true;

		if (this.remainToTick) {
			resume(this, now);
		}
		else {
			runTick(this, now);
		}
	}

	stop (now = Date.now()) {
		if (!this.isActive) return;
		console.log('stop', now);

		this.isActive = false;
		
		const fromLastTick = now - this.lastTick;
		
		this.remainToTick = this.interval - fromLastTick;
	}

	reset (now = Date.now()) {
		clearTimeout(this.ref);
		this.ref = null;
		this.remainToTick = 0;
		
		if (this.isActive) {
			this.isActive = false;
			this.start(now);			
		}
	}
}

module.exports = Ticker;

function validateArgs (interval, callback) {
	if (interval < 50) {
		throw new Error('Ticker interval should be at least 50ms');
	}
	
	if (typeof callback !== 'function') {
		throw new Error('Ticker callback nust be a function');
	}
}
