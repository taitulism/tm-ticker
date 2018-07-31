/** 
	These are the Ticker class private methods.	
	First argument is: `T` which is a ticker instance.
 */
module.exports = {
	resume,
	runTick,
};


function resume (T, now = Date.now()) {
	const targetTime = now + T.remainToTick;

	if (T.remainToTick >= 50) {
		setMetaTick(T, targetTime);
	}
	else {
		runMetaTick(T, targetTime);
	}
	
	T.remainToTick = 0;
}

function runTick (T, targetTime) {
	if (!T.isActive) return;

	T.lastTick = targetTime;

	setMetaTick(T, targetTime + T.interval);
	const now = Date.now()
	console.log('-now', now);
	T.callback(targetTime);
}


// runs at least 50ms before tick
function setMetaTick (T, targetTime) {
	const timeLeft = targetTime - Date.now();

	T.ref = setTimeout(() => {
		if (!T.isActive) return;

		runMetaTick(T, targetTime);
	}, timeLeft - 26);
}


// runs ~26ms before tick
function runMetaTick (T, targetTime) {
	const timeLeft = targetTime - Date.now();

	if (timeLeft <= 12) {
		runTick(T, targetTime);
	}
	
	T.ref = setTimeout(() => {
		T.isActive && runTick(T, targetTime);
	}, timeLeft - 5);
}
