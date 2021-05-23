import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { ITestObj, Ticker } from '../common';

export default function reset (test: ITestObj) {
	describe('.reset()', () => {
		describe('when called while running', () => {
			describe('with start-tick flag', () => {
				it('ticks on call', () => {
					test.ticker = new Ticker(100, test.spy, true, test.mockWorker);

					test.ticker.start();
					expect(test.spy.callCount).to.equal(1);

					test.clock.tick(100);
					expect(test.spy.callCount).to.equal(2);

					test.ticker.reset();
					expect(test.spy.callCount).to.equal(3);
				});
			});

			describe('without start-tick flag', () => {
				it('doesn\'t tick on call', () => {
					test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

					test.ticker.start();
					expect(test.spy.callCount).to.equal(0);

					test.clock.tick(100);
					expect(test.spy.callCount, 'before reset').to.equal(1);
					test.ticker.reset();
					expect(test.spy.callCount, 'after reset').to.equal(1);
				});
			});

			it('does not stop ticking', () => {
				test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

				test.ticker.start();

				test.clock.tick(100);
				expect(test.spy.callCount, 'before reset').to.equal(1);
				test.ticker.reset();
				expect(test.spy.callCount, 'after reset').to.equal(1);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(2);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(3);
			});

			it('sets a new starting point to calc the interval from', () => {
				test.ticker = new Ticker(100, test.spy, undefined, test.mockWorker);

				test.ticker.start();
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(250);
				expect(test.spy.callCount).to.equal(3);

				test.ticker.reset();
				expect(test.spy.callCount, 'reset').to.equal(4);

				test.clock.tick(70);
				expect(test.spy.callCount, 'reset + 70').to.equal(4);

				test.clock.tick(30);
				expect(test.spy.callCount).to.equal(5);
			});
		});

		describe('when called after .stop()', () => {
			it('resets to zero the remaining ms to next tick', () => {
				test.ticker = new Ticker(100, test.spy, false);

				test.ticker.start();

				test.clock.tick(90);

				test.ticker.stop();
				expect(test.ticker.timeToNextTick).to.equal(10);

				test.ticker.reset();
				expect(test.ticker.timeToNextTick).to.equal(0);

				test.ticker.start();
				expect(test.ticker.timeToNextTick).to.equal(100);

				test.clock.tick(60);

				expect(test.ticker.timeToNextTick).to.equal(40);
			});
		});
	});
}
