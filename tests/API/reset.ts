import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function reset (test: ITestObj): void {
	describe('.reset()', () => {
		describe('when called while running', () => {
			it('does not stop ticking', () => {
				test.ticker = new Ticker(100, test.spy, false);

				test.ticker.start();

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(100);
				expect(test.spy.callCount, 'before reset').to.equal(2);
				test.ticker.reset();
				expect(test.spy.callCount, 'after reset').to.equal(2);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(3);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(4);
			});

			it('sets a new starting point to calculate the interval from', () => {
				test.ticker = new Ticker(100, test.spy, false);

				expect(test.spy.callCount).to.equal(0);
				test.ticker.start();
				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(170);
				expect(test.spy.callCount, 'before reset').to.equal(2);

				test.ticker.reset();
				expect(test.spy.callCount, 'after reset').to.equal(2);

				test.clock.tick(30);
				// Equals 3 means same starting point
				expect(test.spy.callCount, 'after reset + 30').to.equal(2);

				test.clock.tick(70);
				expect(test.spy.callCount).to.equal(3);
			});

			it('sets `timeToNextTick` to the interval value', () => {
				const INTERVAL = 100;

				test.ticker = new Ticker(INTERVAL, test.spy, false);

				test.ticker.start();
				test.clock.tick(90);

				expect(test.ticker.timeToNextTick).to.equal(10);
				test.ticker.reset();
				expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

				test.clock.tick(60);
				expect(test.ticker.timeToNextTick).to.equal(40);
			});

			describe('with start-tick flag', () => {
				it('ticks on call', () => {
					test.ticker = new Ticker(100, test.spy, true);

					test.ticker.start();
					expect(test.spy.callCount).to.equal(1);

					test.clock.tick(100);
					expect(test.spy.callCount).to.equal(2);

					test.ticker.reset();
					expect(test.spy.callCount).to.equal(3);

					test.clock.tick(100);
					expect(test.spy.callCount).to.equal(4);
				});
			});

			describe('without start-tick flag', () => {
				it('doesn\'t tick on call', () => {
					test.ticker = new Ticker(100, test.spy, false);

					test.ticker.start();
					expect(test.spy.callCount).to.equal(0);

					test.clock.tick(100);
					expect(test.spy.callCount, 'before reset').to.equal(1);
					test.ticker.reset();
					expect(test.spy.callCount, 'after reset').to.equal(1);

					test.clock.tick(100);
					expect(test.spy.callCount).to.equal(2);
				});
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
			});
		});
	});
}
