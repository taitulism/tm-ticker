class Ticker {
	constructor (interval, callback) {
		validateArgs(interval, callback);

		this.interval = interval;
		this.callback = callback;
		this.ref = null;
		this.isTicking = false;
		this.remainToTick = 0;
	}
	
	start (now) {
		if (this.isTicking) return;

		now = now || Date.now();

		if (this.remainToTick) {
			this._resume(now);
		}
		else {
			this.isTicking = true;
			this.tick(now);
		}
	}

	stop (now) {
		if (!this.isTicking) return;

		now = now || Date.now();

		this.isTicking = false;
		
		const fromLastTick = now - this.lastTick;
		
		this.remainToTick = this.interval - fromLastTick;
	}

	reset (now) {
		clearTimeout(this.ref);
		this.ref = null;
		this.remainToTick = 0;
		
		if (this.isTicking) {
			this.isTicking = false;
			now = now || Date.now();
			this.start(now);			
		}
	}

	_resume (now) {
		if (this.isTicking) return;

		now = now || Date.now();

		this.isTicking = true;
		
		const targetTime = now + this.remainToTick;

		if (this.remainToTick >= 50) {
			this.setMetaTick(targetTime);
		}
		else {
			this.metaTick(targetTime);
		}
		
		this.remainToTick = 0;
	}

	// runs at least 50ms before tick
	setMetaTick (targetTime) {
		const timeLeft = targetTime - Date.now();

		this.ref = setTimeout(() => {
			if (!this.isTicking) return;

			this.metaTick(targetTime);
		}, timeLeft - 26);
	}
	
	// runs ~26ms before tick
	metaTick (targetTime) {
		const timeLeft = targetTime - Date.now();

		if (timeLeft <= 12) {
			this.tick(targetTime);
		}
		
		this.ref = setTimeout(() => {
			this.isTicking && this.tick(targetTime);
		}, timeLeft - 5);
	}

	tick (targetTime) {
		if (!this.isTicking) return;

		this.lastTick = targetTime;

		this.setMetaTick(targetTime + this.interval);
		this.callback(targetTime);
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
