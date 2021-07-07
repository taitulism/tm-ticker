import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function setInterval (test: ITestObj): void {
	describe('.setInterval(number)', () => {
		it('if valid - sets interval prop', function () {
			test.ticker = new Ticker();

			test.ticker.setInterval(100);

			expect(test.ticker.interval).to.equal(100);
		});

		it('if invalid - throws an error', function () {
			function wrapper () {
				test.ticker = new Ticker();

				// @ts-expect-error test errors
				test.ticker.setInterval('not a number');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
