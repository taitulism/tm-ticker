import { createSetTimeListener } from './set-time-listener';
import { Milliseconds, TimeoutObject, Timestamp } from './types';
import {
	resume,
	runTick,
	setNextTick,
	abort,
} from './private-methods';

const MIN_INTERVAL = 50;
const DEFAULT_INTERVAL = 1000;

type TickerOptions = {
	tickOnStart ? : boolean;
	timeoutObj ? : TimeoutObject;
}

type Interval = Milliseconds;
type TickHandler = VoidFunction;

type FirstArg = undefined | Milliseconds | TickHandler | TickerOptions;
type SecondArg = TickHandler | TickerOptions;
type ThirdArg = TickerOptions;


export default class Ticker {
	interval: Interval;
	tickHandler: TickHandler;
	isTicking: boolean = false;
	tickOnStart: boolean;
	remainder: number = 0;
	nextTick: number = 0;
	abortFn: VoidFunction | void; // TODO: type
	setTimeListener: (
		target: Timestamp,
		callback: VoidFunction
	) => VoidFunction | void

	constructor ();
	constructor (interval: Interval);
	constructor (tickHandler: TickHandler);
	constructor (options: TickerOptions);
	constructor (interval: Interval, tickHandler: TickHandler);
	constructor (interval: Interval, options: TickerOptions);
	constructor (tickHandler: TickHandler, options: TickerOptions);
	constructor (interval: Interval, tickHandler: TickHandler, options: TickerOptions);
	constructor (
		firstArg?: FirstArg,
		secondArg?: SecondArg,
		thirdArg?: ThirdArg
	) {
		const [
			interval,
			tickHandler,
			options,
		] = resolveArgs(firstArg, secondArg, thirdArg);

		interval && this.setInterval(interval);
		tickHandler && this.onTick(tickHandler);

		this.tickOnStart = options.tickOnStart;

		// this.tickOnStart = options?.tickOnStart || true;

		this.abortFn = undefined; // TODO: null? but null is not void. make optional?
		this.setTimeListener = createSetTimeListener(options.timeoutObj);
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

function resolveArgs (
	firstArg?: FirstArg,
	secondArg?: SecondArg,
	thirdArg?: ThirdArg
): [Interval, TickHandler, TickerOptions] {

	/* typesMap {
		number?: Interval;
		function?: TickHandler;
		object?: TickerOptions;
	} */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const typesMap: any = {};

	typesMap[typeof firstArg] = firstArg;
	typesMap[typeof secondArg] = secondArg;
	typesMap[typeof thirdArg] = thirdArg; // TODO: better check object

	const interval: Interval = typesMap.number || DEFAULT_INTERVAL;
	const tickHandler: TickHandler = typesMap.function || (() => undefined);
	const options: TickerOptions = {
		...{
			tickOnStart: true,
			timeoutObj: window,
		},
		...(typesMap.object || {}),
	};

	return [interval, tickHandler, options];
}
