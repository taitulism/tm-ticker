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
const DEFAULT_INTERVAL = 1000;

export class Ticker {
	isTicking: boolean = false;
	remainder: number = 0;
	nextTick: number = 0;
	abortFn: VoidFunction | void; // TODO: type
	setTimeListener: (
		target: Timestamp,
		callback: VoidFunction
	) => VoidFunction | void

	static create ({
		interval,
		tickHandler,
		tickOnStart,
		timeoutObj,
	}: Partial<TickerOptions> = {}): Ticker {
		return new Ticker(interval, tickHandler, tickOnStart, timeoutObj);
	}

	constructor (
		public interval: Milliseconds = DEFAULT_INTERVAL,
		public tickHandler: TickHandler = noop,
		public tickOnStart: boolean = true,
		public timeoutObj: TimeoutObject = globalThis,
	) {
		this.setInterval(interval);
		this.onTick(tickHandler);
		this.abortFn = undefined;
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
	if (typeof interval !== 'number' || interval < MIN_INTERVAL) {
		throw new Error('Ticker interval should be a number greater than 50');
	}
}

function validateTickHandler (tickHandler: VoidFunction) {
	if (typeof tickHandler !== 'function') {
		throw new Error('Ticker `tickHandler` must be a function');
	}
}


Ticker.create({})
new Ticker()
