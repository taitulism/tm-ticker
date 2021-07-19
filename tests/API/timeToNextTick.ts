import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function timeToNextTick (test: ITestObj): void {
	describe('.timeToNextTick', () => {
		it('returns the time left to next tick in milliseconds', () => {
			const INTERVAL = 100;

			test.ticker = new Ticker({
				interval: INTERVAL,
				tickOnStart: false,
			});

			expect(test.ticker.timeToNextTick).to.equal(0);

			test.ticker.start();
			test.clock.tick(170);

			expect(test.ticker.timeToNextTick).to.equal(30);

			test.clock.tick(30);
			expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

			test.clock.tick(140);
			test.ticker.stop();

			expect(test.ticker.timeToNextTick).to.equal(60);
			test.clock.tick(50);
			expect(test.ticker.timeToNextTick).to.equal(60);

			test.ticker.reset();
			expect(test.ticker.timeToNextTick).to.equal(0);

			test.clock.tick(50);
			expect(test.ticker.timeToNextTick).to.equal(0);

			test.ticker.start();
			test.clock.tick(51);
			expect(test.ticker.timeToNextTick).to.equal(49);
			test.clock.tick(49);
			expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

			test.ticker.reset();
			expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

			test.clock.tick(32);
			expect(test.ticker.timeToNextTick).to.equal(68);

			test.clock.tick(68);
			expect(test.ticker.timeToNextTick).to.equal(INTERVAL);

			test.ticker.stop();
			expect(test.ticker.timeToNextTick).to.equal(INTERVAL);
		});
	});
}
