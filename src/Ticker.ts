import stow from 'set-timeout-worker';

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
	interval: Milliseconds = DEFAULT_INTERVAL;
	tickOnStart: boolean;
	abortFn: VoidFunction | void;
	callback?: VoidFunction;

	constructor (interval?: number, callback?: VoidFunction, tickOnStart: boolean = true) {
		interval && this.setInterval(interval);
		callback && this.setCallback(callback);

		this.tickOnStart = tickOnStart;
		this.abortFn = undefined; // TODO: null? but null is not void. make optional?
		stow.start();
	}

	getTimeLeft (now = getNow()) {
		if (this.isRunning) {
			return this.nextTick - now;
		}

		return this.timeLeft;
	}

	setInterval (interval: number) {
		validateInterval(interval);

		this.interval = interval;

		return this;
	}

	setCallback (fn: VoidFunction) {
		validateCallback(fn);

		this.callback = fn;

		return this;
	}

	set (interval: number, fn: VoidFunction) {
		this.setInterval(interval);
		this.setCallback(fn);

		return this;
	}

	start (now = getNow()) {
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

	stop (now = getNow()) {
		if (!this.isRunning) return this;

		this.isRunning = false;

		abort(this);

		this.timeLeft = this.nextTick - now;

		return this;
	}

	reset (now = getNow()) {
		abort(this);

		this.timeLeft = 0;
		this.nextTick = 0;

		if (this.isRunning) {
			this.isRunning = false;
			this.start(now);
		}

		return this;
	}

	destroy () {
		this.stop().reset();
		stow.stop();
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
