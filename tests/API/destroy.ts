import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { Ticker } from '../common';

export default function destroy () {
	describe('.destroy()', () => {
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
			mockWorker.terminate();
		});

		after(() => {
			myTicker.destroy();
		});

		it('cannot be started again', () => {
			myTicker = new Ticker(100, spy, false, mockWorker);

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			expect(myTicker.isOk).to.be.true;
			myTicker.destroy();
			expect(myTicker.isOk).to.be.false;

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);
		});

		it('unless setting `.isOk` to true', () => {
			myTicker = new Ticker(100, spy, false, mockWorker);

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			myTicker.destroy();
			myTicker.isOk = true;

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(6);
		});
	});
}
