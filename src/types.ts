export type Milliseconds = number;
export type Timestamp = number;
export type TimeoutRef = number;
export type TickHandler = VoidFunction;

type TimeoutCallback = (...args: Array<unknown>) => void;

export type TimeoutObject = {
	setTimeout: (callback: TimeoutCallback, ms: number, ...args: Array<unknown>) => TimeoutRef;
	clearTimeout: (id: TimeoutRef) => void;
}

export type TickerOptions = {
	interval: Milliseconds;
	tickHandler: TickHandler;
	tickOnStart: boolean;
	timeoutObj : TimeoutObject;
}
