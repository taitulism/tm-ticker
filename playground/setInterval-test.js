module.exports = startSetIntervalTest;

function startSetIntervalTest (startTime, TICK, tickFn) {
	const ref = setInterval(() => {
		tickFn(startTime);
	}, TICK);

	return function stop () {
		clearInterval(ref);
	};
}
