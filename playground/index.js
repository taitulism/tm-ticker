/* eslint-disable no-console, max-statements */

const setIntervalTest = require('./setInterval-test');
const setTimeoutTest = require('./setTimeout-test');
const AFSetTimeoutTest = require('./autofixing-setTimeout-test');
const tickerTest = require('./Ticker-test');
const logTable = require('./log-table');

// Config here
const TICK = 100;
const TICKS_PER_TEST = 25;

const SECOND = 1000;
const TRUNCATED_TIMESTAMP_LENGTH = 7;


console.log('Benchmarking...');
console.log('setInterval vs. setTimeout vs. auto-fixing-setTimeout vs. Ticker');

// ------------------
const testNames = [
	'setInterval',
	'setTimeout',
	'Auto-fixing SetTimeout',
	'Ticker',
];

const testFns = [
	setIntervalTest,
	setTimeoutTest,
	AFSetTimeoutTest,
	tickerTest,
];

let currentTestIndex = 0;
// ------------------

let stopCurrentTest;
let ticksCount = 0;

runNextTest();

function runNextTest () {
	const testName = testNames[currentTestIndex];

	if (!testName) return; // Done.

	const testFn = testFns[currentTestIndex];

	setTimeout(() => {
		runTest(testName, testFn);
	}, SECOND);

	currentTestIndex++;
}

function runTest (testName, testFn) {
	const startingAt = Date.now();

	logTable.head(testName, startingAt);

	stopCurrentTest = testFn(startingAt, TICK, tickFn);
}


function tickFn (startTime) {
	ticksCount++;

	logTick(startTime, ticksCount);

	if (ticksCount >= TICKS_PER_TEST) {
		logTable.tail();

		stopCurrentTest();
		ticksCount = 0;

		runNextTest();
	}
}


// Logging
const truncateMs = ms => String(ms).substr(TRUNCATED_TIMESTAMP_LENGTH);

function logTick (startTime) {
	const now = Date.now();

	const target = startTime + (TICK * ticksCount); // Ideal timestamp

	let diff;

	if (now === target) {
		diff = '  PERFECT! ';
	}
	else if (now < target) {
		diff = `${target - now}ms (early)`;
	}
	else {
		const diffNumer = (now - target);

		diff = `${diffNumer}ms`;

		if (shouldPad(diffNumer)) {
			diff += ' ';
		}

		diff += ' (late)';
	}

	const count = shouldPad(ticksCount)
		? ` ${ticksCount}`
		: ticksCount;

	logTable.row(
		count,
		truncateMs(target),
		truncateMs(now),
		diff
	);
}

function shouldPad (num) {
	return num < 10; // eslint-disable-line no-magic-numbers
}
