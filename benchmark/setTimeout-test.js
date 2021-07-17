module.exports = startSetTimeoutTest;

function startSetTimeoutTest (startTime, interval, tickHandler) {
	let ref;
	let isStopped = false;

	function setNextTick () {
		ref = setTimeout(() => {
			tickHandler(startTime);

			if (!isStopped) {
				setNextTick();
			}
		}, interval);
	}

	setNextTick();

	return function stop () {
		isStopped = true;
		clearTimeout(ref);
	};
}
