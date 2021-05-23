import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function setInterval (test: ITestObj) {
	describe('.setInterval()', () => {
		it('sets interval prop', function () {
			test.ticker = new Ticker();

			test.ticker.setInterval(300);

			expect(test.ticker.interval).to.equal(300);
		});
	});
}
