/* eslint-disable no-console, max-statements */

const Ticker = require('..');

const t = new Ticker(500, () => {
	console.log('tick');
})

t.reset()

// setTimeout(() => {
// 	t.stop();
// }, 4000);
