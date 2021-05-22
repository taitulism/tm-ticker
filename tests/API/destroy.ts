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
			myTicker.destroy();
		});

		it('following calls to .start() will throw', () => {
			myTicker = new Ticker(100, spy, false, mockWorker);

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			myTicker.destroy();

			const throwingFn = () => {
				myTicker.start();
			};

			expect(throwingFn).to.throw('cannot be started after destruction');
		});

		it('stops ticking', () => {
			myTicker = new Ticker(100, spy, false, mockWorker);

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			expect(myTicker.isDestroyed).to.be.false;
			myTicker.destroy();
			expect(myTicker.isDestroyed).to.be.true;

			try {
				myTicker.start();
			}
			catch (err) {
				// ignore error
			}

			clock.tick(300);
			expect(spy.callCount).to.equal(3);
		});
	});
}
