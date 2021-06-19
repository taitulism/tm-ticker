import { createSetTimeListener } from './set-time-listener';
import { Milliseconds, TimeoutObject, Timestamp } from './types';
import {
	resume,
	runTick,
	setNextTick,
	abort,
} from './private-methods';

const MIN_INTERVAL = 50;
const DEFAULT_INTERVAL = 500;
const DESTRUCTION_ERROR = 'Ticker instance cannot be started after destruction.';


export default class Ticker {
	isTicking: boolean = false;
	isDestroyed: boolean = false;
	remainder: number = 0;
	nextTick: number = 0;
	abortFn: VoidFunction | void; // TODO: type
	setTimeListener: (
		target: Timestamp,
		callback: VoidFunction
	) => VoidFunction | void

	constructor (
		public interval: Milliseconds = DEFAULT_INTERVAL,
		public tickHandler?: VoidFunction,
		public tickOnStart: boolean = true,
		public timeoutObject: TimeoutObject = window,
	) {
		interval && this.setInterval(interval);
		tickHandler && this.onTick(tickHandler);

		this.tickOnStart = tickOnStart;
		this.abortFn = undefined; // TODO: null? but null is not void. make optional?
		this.setTimeListener = createSetTimeListener(timeoutObject);
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

	set (interval: number, fn: VoidFunction): Ticker {
		this.setInterval(interval);
		this.onTick(fn);

		return this;
	}

	start (now = Date.now()): Ticker {
		if (this.isDestroyed) throw new Error(DESTRUCTION_ERROR);
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

	destroy (): void {
		this.stop().reset();
		this.isDestroyed = true;
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
