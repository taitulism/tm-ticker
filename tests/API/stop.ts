import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker, setTimeoutWorker } from 'set-timeout-worker';
import { Ticker } from '../common';

export default function stop () {
	describe('.stop()', () => {
		let myTicker: Ticker,
			mockWorker: Worker,
			spy: SinonSpy,
			clock: SinonFakeTimers
		;

		before(() => {
			setTimeoutWorker.stop();
		});

		beforeEach(() => {
			mockWorker = new MockWorker('mock-url');
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
			myTicker.destroy();
		});

		it('stops ticking', () => {
			myTicker = new Ticker(100, spy, true, mockWorker);

			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(1);

			clock.tick(200);
			expect(spy.callCount, 'before stop').to.equal(3);
			myTicker.stop();

			clock.tick(300);
			expect(spy.callCount, 'after stop').to.equal(3);
		});

		it('saves the remaining ms to next tick', () => {
			myTicker = new Ticker(100, spy, true, mockWorker);

			myTicker.start();

			clock.tick(360);
			expect(myTicker.timeLeft).to.equal(0);
			myTicker.stop();
			expect(myTicker.timeLeft).to.equal(40);
		});
	});
}
