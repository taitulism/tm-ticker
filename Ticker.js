class Ticker {
	constructor (interval, callback) {
		if (interval < 100) {
			throw new Error('Ticker interval should be at least 100ms');
		}

		this.interval = interval;
		this.callback = callback;
		this.isRunning = false;
	}
	
	start () {
		const now = Date.now();

		this.isRunning = true;

		const targetTime = now + this.interval;

		this.setMetaTick(now, targetTime);
	}

	// runs at least 100ms before tick
	setMetaTick (now, targetTime) {
		const timeLeft = targetTime - now;

		setTimeout(() => {
			if (this.isRunning) {
				this.metaTick(targetTime);
			}
		}, timeLeft - 50);
	}
	
	// runs 50ms before tick
	metaTick (targetTime) {
		const now = Date.now();
		const timeLeft = targetTime - now;

		if (timeLeft <= 12) {
			return this.callback(now, targetTime);
		}

		setTimeout(() => {
			if (this.isRunning) {
				const newTargetTime = targetTime + this.interval;
				
				this.tick(targetTime, newTargetTime);
			}
		}, timeLeft - 5);
	}

	tick (currentTargetTime, nextTargetTime) {
		if (this.isRunning) {
			const now = Date.now();

			this.callback(now, currentTargetTime);

			this.setMetaTick(currentTargetTime, nextTargetTime);
		}
	}

	pause () {
		this.isRunning = false;
	}

	reset () {}
}

module.exports = Ticker;
