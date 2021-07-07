import { createSetTimeListener } from './set-time-listener';
import { Milliseconds, Timestamp, TickerOptions } from './types';
import { MIN_INTERVAL, noop } from './common';
import { CANNOT_START_WITHOUT_INTERVAL, INVALID_INTERVAL, INVALID_TICK_HANDLER } from './errors';
import {
	resume,
	runTick,
	setNextTick,
	abort,
} from './private-methods';

export class Ticker {
	interval?: Milliseconds;
	isTicking: boolean = false;
	remainder: number = 0;
	nextTick: number = 0;
	tickOnStart: boolean = true;
	tickHandler: VoidFunction = noop;
	abortFn: VoidFunction | void = undefined; // TODO: type
	setTimeListener: (
		target: Timestamp,
		callback: VoidFunction
	) => VoidFunction | void

	constructor (opts: TickerOptions = {}) {
		const {
			interval,
			tickHandler,
			tickOnStart = true,
			timeoutObj = globalThis,
		} = opts;

		interval && this.setInterval(interval);
		tickHandler && this.onTick(tickHandler);
		this.tickOnStart = tickOnStart;
		this.setTimeListener = createSetTimeListener(timeoutObj);
	}

	get timeToNextTick (): Milliseconds {
		return this.isTicking
			? this.nextTick - Date.now()
			: this.remainder
		;
	}

	setInterval (interval: Milliseconds): Ticker {
		validateInterval(interval);

		this.interval = interval;

		return this;
	}

	onTick (fn: VoidFunction): Ticker {
		validateTickHandler(fn);

		this.tickHandler = fn;

		return this;
	}

	start (now = Date.now()): Ticker {
		if (!this.interval) throw new Error(CANNOT_START_WITHOUT_INTERVAL);
		if (this.isTicking) return this;

		this.isTicking = true;

		if (this.remainder) {
			resume(this, now);
		}
		else if (this.tickOnStart) {
			runTick(this, now);
		}
		else {
			setNextTick(this, now + this.interval);
		}

		return this;
	}

	stop (now = Date.now()): Ticker {
		if (!this.isTicking) return this;

		this.isTicking = false;

		abort(this);

		this.remainder = this.nextTick - now;

		return this;
	}

	reset (now = Date.now()): Ticker {
		abort(this);

		this.remainder = 0;
		this.nextTick = 0;

		if (this.isTicking) {
			this.isTicking = false;
			this.start(now);
		}

		return this;
	}
}

function validateInterval (interval: number) {
	const intervalIsNotANumber = typeof interval !== 'number' || Number.isNaN(interval);

	if (intervalIsNotANumber || interval < MIN_INTERVAL) {
		throw new Error(INVALID_INTERVAL);
	}
}

function validateTickHandler (tickHandler: VoidFunction) {
	if (typeof tickHandler !== 'function') {
		throw new Error(INVALID_TICK_HANDLER);
	}
}
