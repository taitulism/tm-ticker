import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker } from 'set-timeout-worker';
import { Ticker } from '../common';

export default function start () {
	describe('.start()', () => {
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

		it('starts ticking and calls the callback on every tick', () => {
			myTicker = new Ticker(100, spy, false, mockWorker);

			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(0);

			clock.tick(300);
			expect(spy.callCount).to.equal(3);
		});

		describe('when constructed with a false flag', () => {
			it('calls the callback on first tick', () => {
				myTicker = new Ticker(100, spy, false, mockWorker);

				expect(spy.callCount).to.equal(0);

				myTicker.start();
				expect(spy.callCount).to.equal(0);

				clock.tick(97);
				expect(spy.callCount).to.equal(0);

				clock.tick(3);
				expect(spy.callCount).to.equal(1);
			});
		});

		describe('when constructed without a flag', () => {
			it('calls the callback on start', () => {
				myTicker = new Ticker(100, spy, undefined, mockWorker);

				expect(spy.callCount).to.equal(0);

				myTicker.start();
				expect(spy.callCount).to.equal(1);

				clock.tick(97);
				expect(spy.callCount).to.equal(1);

				clock.tick(3);
				expect(spy.callCount).to.equal(2);
			});
		});

		describe('when called after .stop()', () => {
			it('resumes from the stopping point', () => {
				myTicker = new Ticker(100, spy, false, mockWorker);

				myTicker.start();
				clock.tick(130);
				expect(spy.callCount).to.equal(1);
				myTicker.stop();

				clock.tick(5000);
				myTicker.start();

				expect(spy.callCount).to.equal(1);
				clock.tick(70);
				expect(spy.callCount).to.equal(2);
			});
		});
	});
}
