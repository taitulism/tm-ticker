import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { Ticker } from '../common';

export default function getTimeLeft () {
	describe('.getTimeLeft()', () => {
		let spy: SinonSpy, clock: SinonFakeTimers;

		beforeEach(() => {
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
		});

		describe('when called while running', () => {
			it('returns the time left to next tick in milliseconds', () => {
				const myTicker = new Ticker(100, spy, false);

				myTicker.start();
				clock.tick(130);
				expect(myTicker.getTimeLeft()).to.equal(70);

				myTicker.destroy();
			});
		});

		describe('when called after .stop()', () => {
			it('returns the time left to next tick in milliseconds', () => {
				const myTicker = new Ticker(100, spy, false);

				myTicker.start();
				clock.tick(140);
				myTicker.stop();
				expect(myTicker.getTimeLeft()).to.equal(60);

				myTicker.destroy();
			});
		});
	});
}
