import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { ITestObj, Ticker } from '../common';

export default function timeToNextTick (test: ITestObj) {
	describe('.timeToNextTick', () => {
		describe('when called while running', () => {
			it('returns the time left to next tick in milliseconds', () => {
				test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

				test.ticker.start();
				test.clock.tick(130);
				expect(test.ticker.timeToNextTick).to.equal(70);
			});
		});

		describe('when called after .stop()', () => {
			it('returns the time left to next tick in milliseconds', () => {
				test.ticker = new Ticker(100, test.spy, false, test.mockWorker);

				test.ticker.start();
				test.clock.tick(140);
				test.ticker.stop();

				expect(test.ticker.timeToNextTick).to.equal(60);
			});
		});
	});
}
