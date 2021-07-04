import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function reset (test: ITestObj): void {
	describe('.reset()', () => {
		describe('when called while running', () => {
			it('does not stop ticking - with `tickOnStart`', () => {
				test.ticker = new Ticker({
					interval: 100,
					tickHandler: test.spy,
					tickOnStart: true,
				});

				test.ticker.start();
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(2);

				test.ticker.reset();
				expect(test.spy.callCount).to.equal(3);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(4);
			});

			it('does not stop ticking - without `tickOnStart`', () => {
				test.ticker = new Ticker({
					interval: 100,
					tickHandler: test.spy,
					tickOnStart: false,
				});

				test.ticker.start();
				expect(test.spy.callCount).to.equal(0);

				test.clock.tick(100);
				expect(test.spy.callCount, 'before reset').to.equal(1);
				test.ticker.reset();
				expect(test.spy.callCount, 'after reset').to.equal(1);

				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(2);
			});

			it('sets a new starting point to calculate the interval from', () => {
				test.ticker = new Ticker({
					interval: 100,
					tickHandler: test.spy,
				});

				test.ticker.start();
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(170);

				expect(test.spy.callCount, 'before reset').to.equal(2);
				test.ticker.reset();
				expect(test.spy.callCount, 'after reset').to.equal(3);

				test.clock.tick(30);

				// Equals 3 here means same starting point
				expect(test.spy.callCount, 'after reset + 30').to.equal(3);

				test.clock.tick(70);
				expect(test.spy.callCount).to.equal(4);
			});

			it('sets `timeToNextTick` to the interval value', () => {
				const INTERVAL = 100;

				test.ticker = new Ticker({
					interval: INTERVAL,
					tickHandler: test.spy,
					tickOnStart: false,
				});

				test.ticker.start();
				test.clock.tick(80);

				expect(test.ticker.timeToNextTick).to.equal(20);
				test.ticker.reset();
				expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

				test.clock.tick(60);
				expect(test.ticker.timeToNextTick).to.equal(40);
			});
		});

		describe('when called after .stop()', () => {
			it('resets to zero the remaining ms to next tick', () => {
				test.ticker = new Ticker({
					interval: 100,
					tickHandler: test.spy,
					tickOnStart: false,
				});

				test.ticker.start();
				test.clock.tick(80);
				test.ticker.stop();

				expect(test.ticker.timeToNextTick).to.equal(20);
				test.ticker.reset();
				expect(test.ticker.timeToNextTick).to.equal(0);

				test.ticker.start();
				expect(test.ticker.timeToNextTick).to.equal(100);
			});
		});
	});
}
