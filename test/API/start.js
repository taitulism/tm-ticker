const sinon = require('sinon');
const {expect} = require('chai');

const { Ticker } = require('../common');

describe('.start()', function () {
	let spy;

	beforeEach(function () {
		spy = sinon.spy();

		this.clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		this.clock.restore();
	});

	it('starts ticking and calls the callback on every tick', function () {
		const myTicker = new Ticker(100, spy, false);

		expect(spy.callCount).to.equal(0);

		myTicker.start();
		expect(spy.callCount).to.equal(0);

		this.clock.tick(300);
		expect(spy.callCount).to.equal(3);

		myTicker.stop();
	});

	describe('when constructed with a false flag', () => {
		it('calls the callback on first tick', function () {
			const myTicker = new Ticker(100, spy, false);

			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(0);

			this.clock.tick(97);
			expect(spy.callCount).to.equal(0);

			this.clock.tick(3);
			expect(spy.callCount).to.equal(1);

			myTicker.stop();
		});
	});

	describe('when constructed without a flag', () => {
		it('calls the callback on start', function () {
			const myTicker = new Ticker(100, spy);

			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(1);

			this.clock.tick(97);
			expect(spy.callCount).to.equal(1);

			this.clock.tick(3);
			expect(spy.callCount).to.equal(2);

			myTicker.stop();
		});
	});

	describe('when called after .stop()', function () {
		it('resumes from the stopping point', function () {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();

			this.clock.tick(130);
			expect(spy.callCount).to.equal(1);

			myTicker.stop();
			this.clock.tick(5000);
			myTicker.start();

			this.clock.tick(70);
			expect(spy.callCount).to.equal(2);

			myTicker.stop();
		});
	});
});
