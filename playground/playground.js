// module is in scope (loaded by ./playground.html)

(async () => {
	try {
		let lastTimestamp = Date.now()
		const ticker = new Ticker(500, () => {
			const now = Date.now();
			console.log(now - lastTimestamp);

			lastTimestamp = now;
		})
		.start()
	}
	catch (err) {
		console.error('ARRRR');
		console.error(err);
	}
})();
