import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function isPaused (test: ITestObj): void {
	describe('.isPaused', () => {
		it('is true when ticker is stopped but not reset', function () {
			const INTERVAL = 100;

			test.ticker = new Ticker({ interval: INTERVAL });

			expect(test.ticker.isPaused, 'before start').to.be.false;
			test.ticker.start();
			expect(test.ticker.isPaused, 'after start 1').to.be.false;
			test.clock.tick(180);
			expect(test.ticker.isPaused, 'after start 2').to.be.false;

			test.ticker.stop();
			expect(test.ticker.timeToNextTick).to.equal(20); // stop with a remainder
			expect(test.ticker.isPaused, 'after stop 1').to.be.true;

			test.ticker.start();
			expect(test.ticker.isPaused, 'after 2nd start 1').to.be.false;
			test.clock.tick(20);
			expect(test.ticker.isPaused, 'after 2nd start 2').to.be.false;

			test.ticker.stop();
			expect(test.ticker.timeToNextTick).to.equal(INTERVAL); // stop right on tick
			expect(test.ticker.isPaused, 'after 2nd stop 1').to.be.true;

			test.ticker.reset();
			expect(test.ticker.isPaused, 'after reset').to.be.false;
			test.ticker.stop();
			expect(test.ticker.isPaused, 'after 2nd stop 2').to.be.false;
		});
	});
}
