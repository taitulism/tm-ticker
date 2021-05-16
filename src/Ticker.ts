import {setTimeoutWorker} from 'set-timeout-worker';

import { getNow } from './utils';
import { Milliseconds } from './types';
import {
	resume,
	runTick,
	setNextTick,
	abort,
} from './private-methods';

const MIN_INTERVAL = 50;
const DEFAULT_INTERVAL = 500;

export default class Ticker {
	isRunning: boolean = false;
	isOk: boolean = true;
	timeLeft: number = 0;
	nextTick: number = 0;
	abortFn: VoidFunction | void;

	constructor (
		public interval: Milliseconds = DEFAULT_INTERVAL,
		public callback?: VoidFunction,
		public tickOnStart: boolean = true
	) {
		interval && this.setInterval(interval);
		callback && this.setCallback(callback);

		this.tickOnStart = tickOnStart;
		this.abortFn = undefined; // TODO: null? but null is not void. make optional?
		setTimeoutWorker.start();
	}

	getTimeLeft (now = getNow()): Milliseconds {
		if (this.isRunning) {
			return this.nextTick - now;
		}

		return this.timeLeft;
	}

	setInterval (interval: Milliseconds): Ticker {
		validateInterval(interval);

		this.interval = interval;

		return this;
	}

	setCallback (fn: VoidFunction): Ticker {
		validateCallback(fn);

		this.callback = fn;

		return this;
	}

	set (interval: number, fn: VoidFunction): Ticker {
		this.setInterval(interval);
		this.setCallback(fn);

		return this;
	}

	start (now = getNow()): Ticker {
		if (this.isRunning || !this.isOk) return this;

		this.isRunning = true;

		if (this.timeLeft) {
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

	stop (now = getNow()): Ticker {
		if (!this.isRunning) return this;

		this.isRunning = false;

		abort(this);

		this.timeLeft = this.nextTick - now;

		return this;
	}

	reset (now = getNow()): Ticker {
		abort(this);

		this.timeLeft = 0;
		this.nextTick = 0;

		if (this.isRunning) {
			this.isRunning = false;
			this.start(now);
		}

		return this;
	}

	destroy (): void {
		this.stop().reset();
		setTimeoutWorker.stop();
		this.isOk = false;
	}
}

function validateInterval (interval: number) {
	if (typeof interval !== 'number' || interval < MIN_INTERVAL) {
		throw new Error('Ticker interval should be a number greater than 50');
	}
}

function validateCallback (callback: VoidFunction) {
	if (typeof callback !== 'function') {
		throw new Error('Ticker callback must be a function');
	}
}
