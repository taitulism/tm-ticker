module.exports = startAutoFixSetTimeoutTest;

function startAutoFixSetTimeoutTest (initialStartTime, TICK, tickFn) {
	let ref;
	let isStopped = false;

	function setNextTick (ms, startTime) {
		const target = startTime + ms;

		ref = setTimeout(() => {
			tickFn(initialStartTime);

			if (!isStopped) {
				const now = Date.now();
				const delay = now - target;

				setNextTick(TICK - delay, now);
			}
		}, ms);
	}

	setNextTick(TICK, initialStartTime);

	return function stop () {
		isStopped = true;
		clearTimeout(ref);
	};
}
