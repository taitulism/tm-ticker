import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { Ticker } from '../common';

export default function start () {
	describe('.start()', () => {
		let spy: SinonSpy, clock: SinonFakeTimers;

		beforeEach(() => {
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
		});

		it('starts ticking and calls the callback on every tick', () => {
			const myTicker = new Ticker(100, spy, false);

			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(0);

			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			myTicker.destroy();
		});

		describe('when constructed with a false flag', () => {
			it('calls the callback on first tick', () => {
				const myTicker = new Ticker(100, spy, false);

				expect(spy.callCount).to.equal(0);

				myTicker.start();
				expect(spy.callCount).to.equal(0);

				clock.tick(97);
				expect(spy.callCount).to.equal(0);

				clock.tick(3);
				expect(spy.callCount).to.equal(1);

				myTicker.destroy();
			});
		});

		describe('when constructed without a flag', () => {
			it('calls the callback on start', () => {
				const myTicker = new Ticker(100, spy);

				expect(spy.callCount).to.equal(0);

				myTicker.start();
				expect(spy.callCount).to.equal(1);

				clock.tick(97);
				expect(spy.callCount).to.equal(1);

				clock.tick(3);
				expect(spy.callCount).to.equal(2);

				myTicker.destroy();
			});
		});

		describe('when called after .stop()', () => {
			it('resumes from the stopping point', () => {
				const myTicker = new Ticker(100, spy, false);

				myTicker.start();
				clock.tick(130);
				expect(spy.callCount).to.equal(1);
				myTicker.stop();

				clock.tick(5000);
				myTicker.start();

				expect(spy.callCount).to.equal(1);
				clock.tick(70);
				expect(spy.callCount).to.equal(2);

				myTicker.destroy();
			});
		});
	});
}
