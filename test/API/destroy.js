/* eslint-env mocha */
/* eslint-disable
	max-lines-per-function,
	no-magic-numbers,
*/

const sinon = require('sinon');
const {expect} = require('chai');

const {Ticker} = require('../common');

describe('.destroy()', () => {
	let spy, clock;

	beforeEach(() => {
		spy = sinon.spy();
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
	});

	it('kills the ticker', () => {
		const myTicker = new Ticker(100, spy, false);

		myTicker.start();
		clock.tick(300);
		expect(spy.callCount).to.equal(3);

		myTicker.destroy();

		myTicker.start();
		clock.tick(300);
		expect(spy.callCount).to.equal(3);
	});

	it('can be revived given a new callback', () => {
		const myTicker = new Ticker(100, spy, false);

		myTicker.start();
		clock.tick(300);
		expect(spy.callCount).to.equal(3);

		myTicker.destroy();

		myTicker.setCallback(spy).start();
		clock.tick(300);
		expect(spy.callCount).to.equal(6);
	});
});
