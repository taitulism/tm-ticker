module.exports = startSetIntervalTest;

function startSetIntervalTest (startTime, interval, tickHandler) {
	const ref = setInterval(() => {
		tickHandler(startTime);
	}, interval);

	return function stop () {
		clearInterval(ref);
	};
}
