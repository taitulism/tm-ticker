import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { ITestObj, Ticker } from '../common';

export default function start (test: ITestObj) {
	describe('.start()', () => {
		it('starts calling the callback on every tick', () => {
			test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

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
			test.ticker = new Ticker(100, test.spy, false, test.mockWorker);
			const ticker = test.ticker.start();

			expect(ticker instanceof Ticker).to.be.true;
		});

		it.skip('Test default interval value', () => {});

		describe('when called after .stop()', () => {
			it('resumes from the stopping point', () => {
				test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

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
