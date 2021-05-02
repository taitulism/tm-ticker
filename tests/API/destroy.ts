import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { Ticker } from '../common';

export default function destroy () {
	describe('.destroy()', () => {
		let spy: SinonSpy, clock: SinonFakeTimers;

		beforeEach(() => {
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
		});

		it('cannot be started again', () => {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			expect(myTicker.isOk).to.be.true;
			myTicker.destroy();
			expect(myTicker.isOk).to.be.false;

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			myTicker.destroy();
		});

		it('unless setting `.isOk` to true', () => {
			const myTicker = new Ticker(100, spy, false);

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(3);

			myTicker.destroy();
			myTicker.isOk = true;

			myTicker.start();
			clock.tick(300);
			expect(spy.callCount).to.equal(6);

			myTicker.destroy();
		});
	});
}
