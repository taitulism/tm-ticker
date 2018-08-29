module.exports = startSetTimeoutTest;

function startSetTimeoutTest (startTime, TICK, tickFn) {
	let ref;
	let isStopped = false;

	function setNextTick () {
		ref = setTimeout(() => {
			tickFn(startTime);

			if (!isStopped) {
				setNextTick();
			}
		}, TICK);
	}
	
	setNextTick();
	
	return function stop () {
		isStopped = true;
		clearTimeout(ref);
	};
}