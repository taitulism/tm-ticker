import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function setCallback (test: ITestObj) {
	describe('.setCallback()', () => {
		it('sets callback prop', function () {
			test.ticker = new Ticker();
			test.ticker.setCallback(test.spy);

			expect(test.ticker.callback).to.equal(test.spy);
		});
	});
}
