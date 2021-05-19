import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker, setTimeoutWorker } from 'set-timeout-worker';
import { Ticker } from '../common';

export default function configuration () {
	describe('Configuration', function () {
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

		describe('.setInterval()', () => {
			it('sets interval prop', function () {
				myTicker = new Ticker();

				myTicker.setInterval(300);

				expect(myTicker.interval).to.equal(300);
			});
		});

		describe('.setCallback()', () => {
			it('sets callback prop', function () {
				myTicker = new Ticker();

				myTicker.setCallback(spy);

				expect(myTicker.callback).to.equal(spy);
			});
		});

		describe('.tickOnStart = bool', () => {
			it('sets the tickOnStart flag', function () {
				myTicker = new Ticker(300, spy, true, mockWorker);

				myTicker.tickOnStart = false;

				myTicker.start();
				expect(spy.callCount).to.equal(0);
				clock.tick(300);
				expect(spy.callCount).to.equal(1);
			});
		});


		describe('.set()', () => {
			it('sets both interval & callback', function () {
				myTicker = new Ticker();

				myTicker.set(300, spy);

				expect(myTicker.interval).to.equal(300);
				expect(myTicker.callback).to.equal(spy);
			});
		});
	});
}
