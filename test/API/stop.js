const sinon = require('sinon');
const {expect} = require('chai');

const { Ticker } = require('../common');

describe('.stop()', function () {
	let spy;

	beforeEach(function () {
		spy = sinon.spy();

		this.clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		this.clock.restore();
	});

	it('stops ticking', function () {
		const myTicker = new Ticker(100, spy);

		expect(spy.callCount).to.equal(0);

		myTicker.start();
		expect(spy.callCount).to.equal(1);
		myTicker.stop();

		this.clock.tick(300);
		expect(spy.callCount).to.equal(1);
	});

	it('saves the remaining ms to next tick', function () {
		const myTicker = new Ticker(100, spy);

		myTicker.start();
		this.clock.tick(60);

		expect(myTicker._timeLeft).to.equal(0);
		myTicker.stop();
		expect(myTicker._timeLeft).to.equal(40);
	});
});
