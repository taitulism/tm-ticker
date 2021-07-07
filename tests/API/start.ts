import {expect} from 'chai';
import { Ticker } from '../../src/Ticker';
import { ITestObj } from '../common';

export default function start (test: ITestObj): void {
	describe('.start()', () => {
		it('starts calling the `tickHandler` on every tick', () => {
			test.ticker = new Ticker({
				interval: 100,
				tickHandler: test.spy,
			});

			expect(test.spy.callCount).to.equal(0);
			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(3);
		});

		it('returns the `Ticker` instance', () => {
			test.ticker = new Ticker({ interval: 100 });

			expect(test.ticker.start()).to.deep.equal(test.ticker);
		});

		it('throws if called with no interval', () => {
			function wrapper () {
				test.ticker = new Ticker();
				test.ticker.start();
			}

			expect(wrapper).to.throw('cannot be started without an interval');
		});

		describe('when called after .stop()', () => {
			it('resumes from the stopping point', () => {
				test.ticker = new Ticker({
					interval: 100,
					tickHandler: test.spy,
				});

				test.ticker.start();
				test.clock.tick(100);
				expect(test.spy.callCount).to.equal(2);
				test.clock.tick(130);
				expect(test.spy.callCount).to.equal(3);
				test.ticker.stop();

				test.clock.tick(4321);
				test.ticker.start();

				expect(test.spy.callCount).to.equal(3);
				test.clock.tick(70);
				expect(test.spy.callCount).to.equal(4);
			});
		});
	});
}
