import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import {expect} from 'chai';
import { MockWorker, setTimeoutWorker } from 'set-timeout-worker';
import { ITestObj, Ticker } from '../common';

export default function stop (test: ITestObj) {
	describe('.stop()', () => {
		it('stops ticking', () => {
			test.ticker = new Ticker(100, test.spy, true, test.mockWorker);

			expect(test.spy.callCount).to.equal(0);

			test.ticker.start();
			expect(test.spy.callCount).to.equal(1);

			test.clock.tick(200);
			expect(test.spy.callCount, 'before stop').to.equal(3);
			test.ticker.stop();

			test.clock.tick(300);
			expect(test.spy.callCount, 'after stop').to.equal(3);
		});
	});
}
