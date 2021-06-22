import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function tickOnStart (test: ITestObj): void {
	describe('.isTicking', () => {
		it('toggles on start/stop', function () {
			test.ticker = new Ticker(100, test.spy);

			expect(test.ticker.isTicking, 'before start').to.be.false;
			test.ticker.start();
			expect(test.ticker.isTicking, 'after start').to.be.true;
			test.ticker.stop();
			expect(test.ticker.isTicking, 'after stop').to.be.false;
		});
	});
}
