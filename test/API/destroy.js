const sinon = require('sinon');
const {expect} = require('chai');

const { Ticker } = require('../common');

describe('.destroy()', () => {
	let spy;

	beforeEach(function () {
		spy = sinon.spy();

		this.clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		this.clock.restore();
	});

	it('kills the ticker', function () {
		const myTicker = new Ticker(100, spy, false)

		myTicker.start();
		this.clock.tick(300);
		expect(spy.callCount).to.equal(3);

		myTicker.destroy();

		myTicker.start();
		this.clock.tick(300);
		expect(spy.callCount).to.equal(3);
	});

	it('can be revived given a new callback', function () {
		const myTicker = new Ticker(100, spy, false)

		myTicker.start()
		this.clock.tick(300);
		expect(spy.callCount).to.equal(3);

		myTicker.destroy();

		myTicker.setCallback(spy).start();
		this.clock.tick(300);
		expect(spy.callCount).to.equal(6);
	});
});
