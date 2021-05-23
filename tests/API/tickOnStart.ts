import {expect} from 'chai';
import { ITestObj, Ticker } from '../common';

export default function tickOnStart (test: ITestObj) {
	describe('.tickOnStart', () => {
		it('when `true`: first tick is right on start', function () {
			test.ticker = new Ticker(100, test.spy, undefined, test.mockWorker);

			test.ticker.tickOnStart = true;

			expect(test.spy.callCount).to.equal(0);
			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
		});

		it('when `false`: first tick is after first interval', function () {
			test.ticker = new Ticker(100, test.spy, undefined, test.mockWorker);

			test.ticker.tickOnStart = false;

			expect(test.spy.callCount).to.equal(0);
			test.ticker.start();
			expect(test.spy.callCount).to.equal(0);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(1);
		});

		it('default is `true`', function () {
			test.ticker = new Ticker(100, test.spy, undefined, test.mockWorker);

			// `true` by default
			// test.ticker.tickOnStart = true;

			expect(test.spy.callCount).to.equal(0);
			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);
			test.clock.tick(100);
			expect(test.spy.callCount).to.equal(2);
		});
	});
}
