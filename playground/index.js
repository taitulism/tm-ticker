const Ticker = require('../');
	
const trunc = function truncateMS (ms) {
	return (ms + '').substr(8);
}

/**
 * The first tick is on start (no interval)
 */
let firstWas = false;
let lastTick = 0;
const myTicker = new Ticker(1000, (ideal, actual = Date.now()) => {
	let diff, txt;

	// console.log('sec len:', actual-lastTick);
	// lastTick = actual;

	if (actual === ideal) {
		diff = 0;
		txt = 'ms PERFECT!!!';
	}
	else if (actual < ideal) {
		diff = ideal - actual;
		txt = ' before';
	}
	else {
		diff = actual - ideal;
		txt = ' delay';
	}
	
	console.log(`{${trunc(ideal)}}`, `>${trunc(actual)}`, `(${diff}${txt})\n`);
	
	if (!firstWas) {
		firstWas = true;
		console.log('**********');
	}
}, true);

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
}, 16100);