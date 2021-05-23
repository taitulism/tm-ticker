import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function destroy (test: ITestObj) {
	describe('.destroy()', () => {
		it('following calls to .start() will throw', () => {
			test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

			test.ticker.start();
			test.clock.tick(300);
			expect(test.spy.callCount).to.equal(3);

			test.ticker.destroy();

			const throwingFn = () => {
				test.ticker!.start();
			};

			expect(throwingFn).to.throw('cannot be started after destruction');
		});

		it('stops ticking', () => {
			test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

			test.ticker.start();
			test.clock.tick(300);
			expect(test.spy.callCount).to.equal(3);

			expect(test.ticker.isDestroyed).to.be.false;
			test.ticker.destroy();
			expect(test.ticker.isDestroyed).to.be.true;

			try {
				test.ticker.start();
			}
			catch (err) {
				// ignore error
			}

			test.clock.tick(300);
			expect(test.spy.callCount).to.equal(3);
		});
	});
}
