import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';
import { noop } from '../../src/common';

export default function onTick (test: ITestObj): void {
	describe('.onTick(fn)', () => {
		it('if valid - sets the `tickHandler` prop', function () {
			test.ticker = new Ticker();
			test.ticker.onTick(noop);

			expect(test.ticker.tickHandler).to.equal(noop);
		});

		it('if invalid - throws an error', function () {
			function wrapper () {
				test.ticker = new Ticker();

				// @ts-expect-error test errors
				test.ticker.onTick('not a function');
			}

			expect(wrapper).to.throw(Error);
		});
	});
}
