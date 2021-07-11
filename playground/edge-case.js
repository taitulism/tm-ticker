/* eslint-disable */

const Ticker = require('..');

const SECOND = 1000;

const myTicker = new Ticker(SECOND, () => {
	console.log('tick');
});

myTicker.reset();

// setTimeout(() => {
// 	myTicker.stop();
// }, 4000);
