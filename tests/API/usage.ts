import sinon, { SinonFakeTimers, SinonSpy } from 'sinon';
import { MockWorker } from 'set-timeout-worker';

import timeToNextTick from './timeToNextTick';
import tickOnStart from './tickOnStart';
import set from './set';
import setInterval from './setInterval';
import setCallback from './setCallback';
import start from './start';
import stop from './stop';
import reset from './reset';
import destroy from './destroy';
import { ITestObj } from '../common';

export default function usage () {
	describe('Usage', () => {
		const testObj: ITestObj = {
			ticker: null,
			mockWorker: new MockWorker('mock-url'),
			spy: sinon.spy(),
			clock: sinon.useFakeTimers(),
		};

		beforeEach(() => {
			testObj.mockWorker = new MockWorker('mock-url');
			testObj.spy = sinon.spy();

			testObj.clock.restore();
			testObj.clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			testObj.clock.restore();
			testObj.ticker?.destroy();
		});

		tickOnStart(testObj);
		set(testObj);
		setInterval(testObj);
		setCallback(testObj);
		start(testObj);
		timeToNextTick(testObj);
		stop(testObj);
		reset(testObj);
		destroy(testObj);
	});
};
