/* eslint-disable */
const TickerModule = require('../dev-bundles/tm-ticker');

module.exports = startTickerTest;

function startTickerTest (startTime, interval, tickHandler) {
	const myTicker = new TickerModule.Ticker({
		interval: interval,
		tickHandler: () => {
			tickHandler(startTime);
		},
		tickOnStart: false
	});

	myTicker.start(startTime);

	return function stop () {
		myTicker.stop();
	};
}
