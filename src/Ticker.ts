import { createSetTimeListener } from './set-time-listener';
import { Milliseconds, Timestamp, TickerOptions } from './types';
import { MIN_INTERVAL, noop } from './common';
import { CANNOT_START_WITHOUT_INTERVAL, INVALID_INTERVAL, INVALID_TICK_HANDLER } from './errors';

export * from './types';

export class Ticker {
	public interval?: Milliseconds;
	public tickHandler: VoidFunction = noop;
	public isTicking: boolean = false;
	public tickOnStart: boolean = true;

	private remainder: number = 0;
	private nextTick: number = 0;
	private abort: VoidFunction = noop;

	static create (intervalOrTickHandler?: Milliseconds | VoidFunction, tickHandler?: VoidFunction): Ticker {
		return typeof intervalOrTickHandler === 'number'
			? new Ticker({interval: intervalOrTickHandler, tickHandler})
			: new Ticker({interval: undefined, tickHandler: intervalOrTickHandler});
	}

	setTimeListener: (
		target: Timestamp,
		callback: VoidFunction
	) => VoidFunction;

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

	get isPaused (): boolean {
		// paused = stopped but not reset
		return !this.isTicking && this.remainder > 0;
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

		if (this.remainder) { // resume
			this.setNextTick(now + this.remainder);

			this.remainder = 0;
		}
		else if (this.tickOnStart) {
			this.runTick(now);
		}
		else {
			this.setNextTick(now + this.interval);
		}

		return this;
	}

	private setNextTick (nextTarget: Timestamp): void {
		this.nextTick = nextTarget;

		this.abort = this.setTimeListener(nextTarget, () => {
			if (this.isTicking) {
				this.runTick(nextTarget);
			}
		});
	}

	private runTick (currentTarget: Timestamp): void {
		const {interval} = this;
		let nextTarget: Timestamp = currentTarget + interval!;

		const now = Date.now();
		const delay = now - currentTarget;

		if (delay > interval!) {
			while (now > nextTarget) {
				nextTarget += interval!;
			}
		}

		this.setNextTick(nextTarget);
		this.tickHandler();
	}

	stop (now = Date.now()): Ticker {
		if (!this.isTicking) return this;

		this.isTicking = false;

		this.abort();

		this.remainder = this.nextTick - now;

		return this;
	}

	reset (now = Date.now()): Ticker {
		this.abort();

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
