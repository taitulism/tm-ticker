import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { ITestObj, Ticker } from '../common';

export default function start (test: ITestObj) {
	describe('.start()', () => {
		it('starts ticking and calls the callback on every tick', () => {
			test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

			expect(test.spy.callCount).to.equal(0);

			test.ticker.start();
			expect(test.spy.callCount).to.equal(0);

			test.clock.tick(300);
			expect(test.spy.callCount).to.equal(3);
		});

		describe('when constructed with a false flag', () => {
			it('calls the callback on first tick', () => {
				test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

				expect(test.spy.callCount).to.equal(0);

				test.ticker.start();
				expect(test.spy.callCount).to.equal(0);

				test.clock.tick(97);
				expect(test.spy.callCount).to.equal(0);

				test.clock.tick(3);
				expect(test.spy.callCount).to.equal(1);
			});
		});

		describe('when constructed without a flag', () => {
			it('calls the callback on start', () => {
				test.ticker = new Ticker(100, test.spy, undefined, test.mockWorker);

				expect(test.spy.callCount).to.equal(0);

				test.ticker.start();
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(97);
				expect(test.spy.callCount).to.equal(1);

				test.clock.tick(3);
				expect(test.spy.callCount).to.equal(2);
			});
		});

		describe('when called after .stop()', () => {
			it('resumes from the stopping point', () => {
				test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

				test.ticker.start();
				test.clock.tick(130);
				expect(test.spy.callCount).to.equal(1);
				test.ticker.stop();

				test.clock.tick(5000);
				test.ticker.start();

				expect(test.spy.callCount).to.equal(1);
				test.clock.tick(70);
				expect(test.spy.callCount).to.equal(2);
			});
		});
	});
}
