import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function set (test: ITestObj): void {
	describe('.set(number, fn)', () => {
		it('if valid - sets both the interval & tickHandler', function () {
			test.ticker = new Ticker();
			test.ticker.set(100, test.spy);

			expect(test.ticker.interval).to.equal(100);
			expect(test.ticker.tickHandler).to.equal(test.spy);
		});

		it('if `interval` is invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error test errors
				test.ticker.set('not a number', noop);
			}

			expect(wrapper).to.throw(Error);
		});

		it('if `tickHandler` is invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error test errors
				test.ticker.set(100, 'not a number');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
