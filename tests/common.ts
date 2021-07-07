import { SinonFakeTimers, SinonSpy } from 'sinon';
import type {Ticker} from '../src/Ticker';

export interface ITestObj {
	ticker: Ticker | null,
	spy: SinonSpy,
	clock: SinonFakeTimers
}
