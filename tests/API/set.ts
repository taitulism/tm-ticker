import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function set (test: ITestObj) {
	describe('.set()', () => {
		it('sets both interval & callback', function () {
			test.ticker = new Ticker();
			test.ticker.set(300, test.spy);

			expect(test.ticker.interval).to.equal(300);
			expect(test.ticker.callback).to.equal(test.spy);
		});
	});
}
