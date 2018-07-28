const Ticker = require('../Ticker');
	
const trunc = function truncateMS (ms) {
	return (ms + '').substr(8);
}

const myTicker = new Ticker(1000, (now, target) => {
	console.log(`*** TICK ***`);
	console.log(`  actual: ${trunc(now)}`);
	console.log(`  target: ${trunc(target)}`);
	console.log(`  diff  : ${target - now}`);
	console.log('');
});


myTicker.start();

setTimeout(() => {
	myTicker.pause();
}, 10000);