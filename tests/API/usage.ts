import sinon from 'sinon';

import timeToNextTick from './timeToNextTick';
import tickOnStart from './tickOnStart';
import setInterval from './setInterval';
import onTick from './onTick';
import start from './start';
import stop from './stop';
import reset from './reset';
import isTicking from './isTicking';
import { ITestObj } from '../common';

export default function usage (): void {
	describe('Usage', () => {
		const testObj: ITestObj = {
			ticker: null,
			spy: sinon.spy(),
			clock: sinon.useFakeTimers(),
		};

		beforeEach(() => {
			testObj.spy = sinon.spy();
			testObj.clock.restore();
			testObj.clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			testObj.clock.restore();
			testObj.ticker?.stop().reset();
		});

		tickOnStart(testObj);
		setInterval(testObj);
		onTick(testObj);
		start(testObj);
		isTicking(testObj);
		timeToNextTick(testObj);
		stop(testObj);
		reset(testObj);
	});
}
