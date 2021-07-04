export type Milliseconds = number;
export type Timestamp = number;
export type TimeoutRef = number;

type TimeoutCallback = (...args: Array<unknown>) => void;

export type TimeoutObject = {
	setTimeout: (callback: TimeoutCallback, ms: number, ...args: Array<unknown>) => TimeoutRef;
	clearTimeout: (id: TimeoutRef) => void;
}

export type TickerOptions = {
	interval?: Milliseconds;
	tickHandler?: VoidFunction;
	tickOnStart?: boolean;
	timeoutObj? : TimeoutObject;
}
