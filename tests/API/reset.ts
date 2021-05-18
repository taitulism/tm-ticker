import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { Ticker } from '../common';

export default function reset () {
	describe('.reset()', () => {
		let myTicker: Ticker,
			mockWorker: Worker,
			spy: SinonSpy,
			clock: SinonFakeTimers
		;

		beforeEach(() => {
			mockWorker = new MockWorker('mock-url');
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
			mockWorker.terminate();
		});

		after(() => {
			myTicker.destroy();
		});

		describe('when called while running', () => {
			describe('with start-tick flag', () => {
				it('ticks on call', () => {
					myTicker = new Ticker(100, spy, true, mockWorker);

					myTicker.start();
					expect(spy.callCount).to.equal(1);

					clock.tick(100);
					expect(spy.callCount).to.equal(2);

					myTicker.reset();
					expect(spy.callCount).to.equal(3);
				});
			});

			describe('without start-tick flag', () => {
				it('doesn\'t tick on call', () => {
					myTicker = new Ticker(100, spy, false, mockWorker);

					myTicker.start();
					expect(spy.callCount).to.equal(0);

					clock.tick(100);
					expect(spy.callCount, 'before reset').to.equal(1);
					myTicker.reset();
					expect(spy.callCount, 'after reset').to.equal(1);
				});
			});

			it('does not stop ticking', () => {
				myTicker = new Ticker(100, spy, false, mockWorker);

				myTicker.start();

				clock.tick(100);
				expect(spy.callCount, 'before reset').to.equal(1);
				myTicker.reset();
				expect(spy.callCount, 'after reset').to.equal(1);

				clock.tick(100);
				expect(spy.callCount).to.equal(2);

				clock.tick(100);
				expect(spy.callCount).to.equal(3);
			});

			it('sets a new starting point to calc the interval from', () => {
				myTicker = new Ticker(100, spy, undefined, mockWorker);

				myTicker.start();
				expect(spy.callCount).to.equal(1);

				clock.tick(250);
				expect(spy.callCount).to.equal(3);

				myTicker.reset();
				expect(spy.callCount, 'reset').to.equal(4);

				clock.tick(70);
				expect(spy.callCount, 'reset + 70').to.equal(4);

				clock.tick(30);
				expect(spy.callCount).to.equal(5);
			});
		});

		describe('when called after .stop()', () => {
			it('resets to zero the remaining ms to next tick', () => {
				myTicker = new Ticker(100, spy, false);

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
			});
		});
	});
}
