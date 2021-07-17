/* eslint-disable */
// module is in scope (loaded by ./playground.html)

import {Ticker} from '../src/Ticker';

try {
	let lastTimestamp = Date.now();

	const ticker = new Ticker({
		interval: 500,
		tickHandler: () => {
			const now = Date.now();
			console.log(now - lastTimestamp);

			lastTimestamp = now;
		}
	});

	ticker.start();
}
catch (err) {
	console.error('ARRRR');
	console.error(err);
}
