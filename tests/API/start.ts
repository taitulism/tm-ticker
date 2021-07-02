import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function start (test: ITestObj): void {
	describe('.start()', () => {
		it('starts calling the `tickHandler` on every tick', () => {
			test.ticker = new Ticker({
				interval: 100,
				tickHandler: test.spy,
				tickOnStart: false,
			});

			expect(test.spy.callCount).to.equal(0);

			test.ticker.start();
			expect(test.spy.callCount).to.equal(0);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(3);
		});

		it('returns a `Ticker` instance', () => {
			test.ticker = new Ticker({
				interval: 100,
				tickHandler: test.spy,
				tickOnStart: false,
			});
			const ticker = test.ticker.start();

			expect(ticker instanceof Ticker).to.be.true;
		});

		it.skip('Test default interval value');

		describe('when called after .stop()', () => {
			it('resumes from the stopping point', () => {
				test.ticker = new Ticker({
					interval: 100,
					tickHandler: test.spy,
					tickOnStart: false,
				});

				test.ticker.start();
				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(1);
				test.clock.tick(130);
				expect(test.spy.callCount).to.equal(2);
				test.ticker.stop();

				test.clock.tick(5000);
				test.ticker.start();

				expect(test.spy.callCount).to.equal(2);
				test.clock.tick(70);
				expect(test.spy.callCount).to.equal(3);
			});
		});
	});
}
