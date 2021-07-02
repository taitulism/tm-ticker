import { createSetTimeListener } from './set-time-listener';
import { Milliseconds, TimeoutObject, Timestamp, TickHandler, TickerOptions } from './types';
import {
	resume,
	runTick,
	setNextTick,
	abort,
} from './private-methods';
import { noop } from './utils';

const MIN_INTERVAL = 50;

export class Ticker {
	isTicking: boolean = false;
	remainder: number = 0;
	nextTick: number = 0;
	tickOnStart: boolean = true;
	interval: Milliseconds = 0;
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
		this.setTimeListener = createSetTimeListener(timeoutObj); // TODO: validate timeoutObj
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

	set (interval: Milliseconds, fn: VoidFunction): Ticker {
		this.setInterval(interval);
		this.onTick(fn);

		return this;
	}

	start (now = Date.now()): Ticker {
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
		throw new Error('Ticker interval should be a number greater than 50');
	}
}

function validateTickHandler (tickHandler: VoidFunction) {
	if (typeof tickHandler !== 'function') {
		throw new Error('Ticker `tickHandler` must be a function');
	}
}
