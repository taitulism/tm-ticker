const sinon = require('sinon');
const {expect} = require('chai');

const { Ticker } = require('../common');

describe('.reset()', () => {
	let spy;

	beforeEach(function () {
		spy = sinon.spy();

		this.clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		this.clock.restore();
	});

	describe('when called while running', () => {
		describe('with start-tick flag', () => {
			it('ticks on call', function () {
				const myTicker = new Ticker(100, spy, true);

				myTicker.start();
				expect(spy.callCount).to.equal(1);

				this.clock.tick(100);
				expect(spy.callCount).to.equal(2);

				myTicker.reset();
				expect(spy.callCount).to.equal(3);
			});
		});

		describe('without start-tick flag', () => {
			it('doesn\'t tick on call', function () {
				const myTicker = new Ticker(100, spy, false);

				myTicker.start();
				expect(spy.callCount).to.equal(0);

				this.clock.tick(100);
				expect(spy.callCount).to.equal(1);

				myTicker.reset();
				expect(spy.callCount).to.equal(1);
			});
		});

		it('does not stop ticking', function () {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();

			this.clock.tick(100);
			expect(spy.callCount).to.equal(1);

			myTicker.reset();
			expect(spy.callCount).to.equal(1);

			this.clock.tick(100);
			expect(spy.callCount).to.equal(2);

			this.clock.tick(100);
			expect(spy.callCount).to.equal(3);

			myTicker.stop();
		});

		it('sets a new starting point to calc the interval from', function () {
			const myTicker = new Ticker(100, spy);

			myTicker.start();
			expect(spy.callCount).to.equal(1);

			this.clock.tick(250);
			expect(spy.callCount).to.equal(3);

			myTicker.reset();
			expect(spy.callCount).to.equal(4);

			// Make sure not using `.timeLeft`
			this.clock.tick(70);
			expect(spy.callCount).to.equal(4);

			this.clock.tick(30);
			expect(spy.callCount).to.equal(5);

			myTicker.stop();
		});
	});

	describe('when called after .stop()', () => {
		it('resets to zero the remaining ms to next tick', function () {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();

			this.clock.tick(90);

			myTicker.stop();
			expect(myTicker.timeLeft).to.equal(10);

			myTicker.reset();
			expect(myTicker.timeLeft).to.equal(0);

			myTicker.start();
			expect(myTicker.timeLeft).to.equal(100);

			this.clock.tick(60);

			expect(myTicker.timeLeft).to.equal(40);

			myTicker.stop();
		});
	});
});
