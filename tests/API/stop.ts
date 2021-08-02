import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function stop (test: ITestObj): void {
	describe('.stop()', () => {
		it('stops ticking', () => {
			test.ticker = Ticker.create(100, test.spy);

			expect(test.spy.callCount).to.equal(0);

			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
			test.clock.tick(100);
			expect(test.spy.callCount, 'before stop').to.equal(3);

			test.ticker.stop();

			test.clock.tick(100);
			expect(test.spy.callCount, 'after stop 1').to.equal(3);
			test.clock.tick(100);
			expect(test.spy.callCount, 'after stop 2').to.equal(3);
			test.clock.tick(500);
			expect(test.spy.callCount, 'after stop 3').to.equal(3);
		});

		it('sets the remainder', () => {
			test.ticker = Ticker.create(100);

			test.ticker.start();
			test.clock.tick(130);

			// @ts-expect-error private member
			expect(test.ticker.remainder).to.equal(0);
			expect(test.ticker.timeToNextTick, 'before stop').to.equal(70);

			test.ticker.stop();

			// @ts-expect-error private member
			expect(test.ticker.timeToNextTick).to.equal(test.ticker.remainder);
			expect(test.ticker.timeToNextTick, 'after stop').to.equal(70);
		});

		it('returns the `Ticker` instance', () => {
			test.ticker = Ticker.create(100);

			test.ticker.start();
			test.clock.tick(200);

			expect(test.ticker.stop()).to.deep.equal(test.ticker);
		});
	});
}
