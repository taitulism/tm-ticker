import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function tickOnStart (test: ITestObj): void {
	describe('.tickOnStart', () => {
		it('when `true` - first tick is right on start', function () {
			test.ticker = new Ticker({
				interval: 100,
				tickHandler: test.spy,
			});

			// test.ticker.tickOnStart = true; // default

			expect(test.spy.callCount).to.equal(0);
			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
		});

		it('when `false` - first tick is after first interval', function () {
			test.ticker = new Ticker({
				interval: 100,
				tickHandler: test.spy,
			});

			test.ticker.tickOnStart = false;

			expect(test.spy.callCount).to.equal(0);
			test.ticker.start();
			expect(test.spy.callCount).to.equal(0);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(1);
		});
	});
}
