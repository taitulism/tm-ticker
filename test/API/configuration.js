/* eslint-env mocha */
/* eslint-disable
	max-lines-per-function,
	no-magic-numbers,
	func-names,
	prefer-arrow-callback,
*/

const sinon = require('sinon');
const {expect} = require('chai');

const {Ticker} = require('../common');

describe('Configuration', function () {
	let spy;

	beforeEach(function () {
		spy = sinon.spy();

		this.clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		this.clock.restore();
	});

	it('sets interval', function () {
		const myTicker = new Ticker();

		myTicker.setInterval(300);

		expect(myTicker.interval).to.equal(300);
	});

	it('sets callback', function () {
		const myTicker = new Ticker();

		myTicker.setCallback(spy);

		expect(myTicker.callback).to.equal(spy);
	});

	it('sets the shouldTickOnStart flag', function () {
		const myTicker = new Ticker(300, spy, true);

		myTicker.setTickOnStart(false);

		myTicker.start();
		expect(spy.callCount).to.equal(0);
		this.clock.tick(300);
		expect(spy.callCount).to.equal(1);
		myTicker.stop();
	});

	it('sets both interval & callback', function () {
		const myTicker = new Ticker();

		myTicker.set(300, spy);

		expect(myTicker.interval).to.equal(300);
		expect(myTicker.callback).to.equal(spy);
	});

	it('can be configured after creation', function () {
		const myTicker = new Ticker();

		myTicker.setInterval(300);
		myTicker.setCallback(spy);

		myTicker.start();
		expect(spy.callCount).to.equal(1);
		this.clock.tick(300);
		expect(spy.callCount).to.equal(2);
		myTicker.stop();
	});
});
