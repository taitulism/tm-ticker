const Ticker = require('../');
	
const trunc = function truncateMS (ms) {
	return (ms + '').substr(8);
}

/**
 * The first tick is on start (no interval)
 */
const myTicker = new Ticker(1000, (target) => {
	const now = Date.now();

	console.log(`*** TICK ***`)
	console.log('actual:', trunc(now));
	console.log('ideal:', trunc(target));

	const diff = now - target;
	if (diff > 0) {
		console.log('* diff:', diff, 'delay');
	}
	else {
		console.log('* diff:', diff, 'before');
	}
});

const now = Date.now();

myTicker.start(now);

setTimeout(() => {
	myTicker.stop();
	myTicker.reset();
	
	setTimeout(() => {
		myTicker.start();

		setTimeout(() => {
			myTicker.stop();
		}, 4000);
	}, 4000);
}, 7000);