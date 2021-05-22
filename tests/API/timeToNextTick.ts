import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { Ticker } from '../common';

export default function timeToNextTick () {
	describe('.timeToNextTick()', () => {
		let myTicker: Ticker,
			mockWorker: Worker,
			spy: SinonSpy,
			clock: SinonFakeTimers
		;

		beforeEach(() => {
			mockWorker = new MockWorker('mock-url');
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
			myTicker.destroy();
		});

		describe('when called while running', () => {
			it('returns the time left to next tick in milliseconds', () => {
				myTicker = new Ticker(100, spy, false, mockWorker);

				myTicker.start();
				clock.tick(130);
				expect(myTicker.timeToNextTick).to.equal(70);
			});
		});

		describe('when called after .stop()', () => {
			it('returns the time left to next tick in milliseconds', () => {
				myTicker = new Ticker(100, spy, false, mockWorker);

				myTicker.start();
				clock.tick(140);
				myTicker.stop();

				expect(myTicker.timeToNextTick).to.equal(60);
			});
		});
	});
}
