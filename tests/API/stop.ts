import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function stop (test: ITestObj): void {
	describe('.stop()', () => {
		it('stops ticking', () => {
			test.ticker = new Ticker(100, test.spy, true);

			expect(test.spy.callCount).to.equal(0);

			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
			test.clock.tick(100);
			expect(test.spy.callCount, 'before stop').to.equal(3);
			test.ticker.stop();

			test.clock.tick(100);
			expect(test.spy.callCount, 'after stop 1').to.equal(3);
			test.clock.tick(100);
			expect(test.spy.callCount, 'after stop 2').to.equal(3);
			test.clock.tick(500);
			expect(test.spy.callCount, 'after stop 3').to.equal(3);
		});

		it('returns a `Ticker` instance', () => {
			test.ticker = new Ticker(100, test.spy, false);
			test.ticker.start();

			test.clock.tick(500);
			const ticker = test.ticker.stop();

			expect(ticker instanceof Ticker).to.be.true;
		});
	});
}
