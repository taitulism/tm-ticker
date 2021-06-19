import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function timeToNextTick (test: ITestObj): void {
	describe('.timeToNextTick', () => {
		describe('when called while running', () => {
			it('returns the time left to next tick in milliseconds', () => {
				const INTERVAL = 100;

				test.ticker = new Ticker(INTERVAL, test.spy, false);

				test.ticker.start();
				test.clock.tick(170);
				expect(test.ticker.timeToNextTick).to.equal(30);

				test.clock.tick(30);
				expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

				test.clock.tick(160);
				expect(test.ticker.timeToNextTick).to.equal(40);
			});
		});

		describe('when called after .stop()', () => {
			it('returns the time left to next tick in milliseconds', () => {
				test.ticker = new Ticker(100, test.spy, false);

				test.ticker.start();
				test.clock.tick(360);
				test.ticker.stop();

				expect(test.ticker.timeToNextTick).to.equal(40);
				test.clock.tick(500);
				expect(test.ticker.timeToNextTick).to.equal(40);
			});
		});

		describe('when called after .stop() & .reset()', () => {
			it('returns the time left to next tick in milliseconds', () => {
				test.ticker = new Ticker(100, test.spy, false);

				test.ticker.start();
				test.clock.tick(360);
				test.ticker.stop().reset();

				expect(test.ticker.timeToNextTick).to.equal(0);
				test.clock.tick(500);
				expect(test.ticker.timeToNextTick).to.equal(0);
			});
		});
	});
}
