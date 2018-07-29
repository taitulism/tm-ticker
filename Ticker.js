class Ticker {
	constructor (interval, callback) {
		validateArgs(interval, callback);

		this.interval = interval;
		this.callback = callback;
		this.isRunning = false;
	}
	
	start (now = Date.now()) {
		this.isRunning = true;

		this.tick(now);
	}

	// runs at least 100ms before tick
	setMetaTick (targetTime) {
		const now = Date.now();
		const timeLeft = targetTime - now;

		setTimeout(() => {
			if (!this.isRunning) return;

			this.metaTick(targetTime);
		}, timeLeft - 26);
	}
	
	// runs 50ms before tick
	metaTick (targetTime) {
		const now = Date.now();
		const timeLeft = targetTime - now;

		if (timeLeft <= 12) {
			this.tick(targetTime);
		}
		
		setTimeout(() => {
			this.isRunning && this.tick(targetTime);
		}, timeLeft - 5);
	}

	tick (targetTime) {
		if (!this.isRunning) return;

		this.setMetaTick(targetTime + this.interval);
		this.callback(targetTime);
	}

	pause () {
		this.isRunning = false;
	}

	reset () {}
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
