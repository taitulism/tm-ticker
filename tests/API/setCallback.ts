import {expect} from 'chai';
import { ITestObj, noop, Ticker } from '../common';

export default function setCallback (test: ITestObj) {
	describe('.setCallback(fn)', () => {
		it('if valid - sets callback prop', function () {
			test.ticker = new Ticker();
			test.ticker.setCallback(noop);

			expect(test.ticker.callback).to.equal(noop);
		});

		it('if invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error
				test.ticker.setCallback('not a function');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
