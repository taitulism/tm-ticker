const Ticker = require('..');

module.exports = startTickerTest;

function startTickerTest (startTime, TICK, tickFn) {
	const myTicker = new Ticker(TICK, () => {
		tickFn(startTime);
	}, false);

	myTicker.start(startTime);

	return function stop () {
		myTicker.stop();
	};
}
