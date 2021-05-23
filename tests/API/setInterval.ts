import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function setInterval (test: ITestObj): void {
	describe('.setInterval(number)', () => {
		it('if valid - sets interval prop', function () {
			test.ticker = new Ticker();

			test.ticker.setInterval(100);

			expect(test.ticker.interval).to.equal(100);
		});

		it('if invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error test errors
				test.ticker.setInterval('not a number');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
