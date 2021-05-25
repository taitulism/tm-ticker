import {expect} from 'chai';
import { ITestObj, noop, Ticker } from '../common';

export default function onTick (test: ITestObj): void {
	describe('.onTick(fn)', () => {
		it('if valid - sets the `tickHandler` prop', function () {
			test.ticker = new Ticker();
			test.ticker.onTick(noop);

			expect(test.ticker.tickHandler).to.equal(noop);
		});

		it('if invalid - throws an error', function () {
			test.ticker = new Ticker();

			function wrapper () {
				// @ts-expect-error test errors
				test.ticker.onTick('not a function');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
