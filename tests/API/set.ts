import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function set (test: ITestObj) {
	describe('.set(number, fn)', () => {
		it('if valid - sets both interval & callback', function () {
			test.ticker = new Ticker();
			test.ticker.set(100, test.spy);

			expect(test.ticker.interval).to.equal(100);
			expect(test.ticker.callback).to.equal(test.spy);
		});

		it('if `interval` is invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error
				test.ticker.set('not a number', noop);
			}

			expect(wrapper).to.throw(Error);
		});

		it('if `callback` is invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error
				test.ticker.set(100, 'not a number');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
