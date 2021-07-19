import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function isTicking (test: ITestObj): void {
	describe('.isTicking', () => {
		it('toggles on start/stop', function () {
			test.ticker = new Ticker({ interval: 100 });

			expect(test.ticker.isTicking, 'before start').to.be.false;
			test.ticker.start();
			expect(test.ticker.isTicking, 'after start').to.be.true;
			test.ticker.stop();
			expect(test.ticker.isTicking, 'after stop').to.be.false;
		});
	});
}
