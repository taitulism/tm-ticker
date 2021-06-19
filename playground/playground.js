/* eslint-disable */
// module is in scope (loaded by ./playground.html)

try {
	let lastTimestamp = Date.now();

	const ticker = new Ticker(500, () => {
		const now = Date.now();
		console.log(now - lastTimestamp);

		lastTimestamp = now;
	});

	ticker.start();
}
catch (err) {
	console.error('ARRRR');
	console.error(err);
}
