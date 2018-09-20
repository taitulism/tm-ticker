/* eslint-env mocha */
/* eslint-disable
	max-lines-per-function,
	no-magic-numbers,
*/

const sinon = require('sinon');
const {expect} = require('chai');

const {Ticker} = require('../common');

describe('.stop()', () => {
	let spy, clock;

	beforeEach(() => {
		spy = sinon.spy();
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
	});

	it('stops ticking', () => {
		const myTicker = new Ticker(100, spy);

		expect(spy.callCount).to.equal(0);

		myTicker.start();
		expect(spy.callCount).to.equal(1);
		myTicker.stop();

		clock.tick(300);
		expect(spy.callCount).to.equal(1);
	});

	it('saves the remaining ms to next tick', () => {
		const myTicker = new Ticker(100, spy);

		myTicker.start();
		clock.tick(60);

		/* eslint-disable no-underscore-dangle */
		expect(myTicker.timeLeft).to.equal(0);
		myTicker.stop();
		expect(myTicker.timeLeft).to.equal(40);
		/* eslint-enable no-underscore-dangle */
	});
});
