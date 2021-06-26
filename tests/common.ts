import { SinonFakeTimers, SinonSpy } from 'sinon';

import {Ticker} from '../src/Ticker';
export {Ticker};

export interface ITestObj {
	ticker: Ticker | null,
	spy: SinonSpy,
	clock: SinonFakeTimers
}
