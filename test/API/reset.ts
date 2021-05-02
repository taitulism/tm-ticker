const sinon = require('sinon');
const {expect} = require('chai');

const {Ticker} = require('../common');

describe('.reset()', () => {
	let spy, clock;

	beforeEach(() => {
		spy = sinon.spy();
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
	});

	describe('when called while running', () => {
		describe('with start-tick flag', () => {
			it('ticks on call', () => {
				const myTicker = new Ticker(100, spy, true);

				myTicker.start();
				expect(spy.callCount).to.equal(1);

				clock.tick(100);
				expect(spy.callCount).to.equal(2);

				myTicker.reset();
				expect(spy.callCount).to.equal(3);

				myTicker.destroy();
			});
		});

		describe('without start-tick flag', () => {
			it('doesn\'t tick on call', () => {
				const myTicker = new Ticker(100, spy, false);

				myTicker.start();
				expect(spy.callCount).to.equal(0);

				clock.tick(100);
				expect(spy.callCount).to.equal(1);

				myTicker.reset();
				expect(spy.callCount).to.equal(1);

				myTicker.destroy();
			});
		});

		it('does not stop ticking', () => {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();

			clock.tick(100);
			expect(spy.callCount).to.equal(1);

			myTicker.reset();
			expect(spy.callCount).to.equal(1);

			clock.tick(100);
			expect(spy.callCount).to.equal(2);

			clock.tick(100);
			expect(spy.callCount).to.equal(3);

			myTicker.destroy();
		});

		it('sets a new starting point to calc the interval from', () => {
			const myTicker = new Ticker(100, spy);

			myTicker.start();
			expect(spy.callCount).to.equal(1);

			clock.tick(250);
			expect(spy.callCount).to.equal(3);

			myTicker.reset();
			expect(spy.callCount).to.equal(4);

			// Make sure not using `.timeLeft`
			clock.tick(70);
			expect(spy.callCount).to.equal(4);

			clock.tick(30);
			expect(spy.callCount).to.equal(5);

			myTicker.destroy();
		});
	});

	describe('when called after .stop()', () => {
		it('resets to zero the remaining ms to next tick', () => {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();

			clock.tick(90);

			myTicker.stop();
			expect(myTicker.timeLeft).to.equal(10);

			myTicker.reset();
			expect(myTicker.timeLeft).to.equal(0);

			myTicker.start();
			expect(myTicker.getTimeLeft()).to.equal(100);

			clock.tick(60);

			expect(myTicker.getTimeLeft()).to.equal(40);

			myTicker.destroy();
		});
	});
});
