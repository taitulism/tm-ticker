const Ticker = require('../Ticker');
	
const trunc = function truncateMS (ms) {
	return (ms + '').substr(8);
}

/**
 * The first tick is on start (no interval)
 */
const myTicker = new Ticker(1000, (target) => {
	const now = Date.now();

	console.log(`*** TICK ***`)
	console.log(trunc(now));
	console.log(trunc(target));
	console.log(now - target);
});


myTicker.start();

setTimeout(() => {
	myTicker.pause();
	
	setTimeout(() => {
		myTicker.start();

		setTimeout(() => {
			myTicker.pause();
		}, 4000);
	}, 4400);
}, 3200);