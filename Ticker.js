class Ticker {
	constructor (interval, callback) {
		validateArgs(interval, callback);

		this.interval = interval;
		this.callback = callback;
		this.isRunning = false;
		this.remainToTick = 0;
		this.isPaused = false;
	}
	
	start (now = Date.now()) {
		this.isRunning = true;

		if (this.isPaused) {
			this.resume(now);
		}
		else {
			this.tick(now);
		}
	}

	resume (now) {
		this.isPaused = false;
		
		if (this.remainToTick >= 50) {
			const targetTime = now + this.remainToTick;
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

		setTimeout(() => {
			if (!this.isRunning) return;

			this.metaTick(targetTime);
		}, timeLeft - 26);
	}
	
	// runs ~26ms before tick
	metaTick (targetTime) {
		const timeLeft = targetTime - Date.now();

		if (timeLeft <= 12) {
			this.tick(targetTime);
		}
		
		setTimeout(() => {
			this.isRunning && this.tick(targetTime);
		}, timeLeft - 5);
	}

	tick (targetTime) {
		if (!this.isRunning) return;

		this.lastTick = targetTime;

		this.setMetaTick(targetTime + this.interval);
		this.callback(targetTime);
	}

	stop () {
		this.pause();
		this.reset();
	}

	pause () {
		const fromLastTick = Date.now() - this.lastTick;
		
		this.isRunning = false;
		this.isPaused = true;
		
		this.remainToTick = this.interval - fromLastTick;
	}

	reset () {
		this.remainToTick = 0;
		this.isPaused = false;
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
