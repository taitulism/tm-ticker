# TM-Ticker
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/tm-ticker.svg?branch=master)](https://travis-ci.org/taitulism/tm-ticker)

An accurate interval ticker class.  

&nbsp;

## TL;DR
```js
const myTicker = new Ticker({
	interval: 1000,
	tickHandler: () => console.log('Tick.')
});

myTicker.start();
myTicker.stop();
myTicker.reset();
```

&nbsp;

## Installation
```sh
$ npm install tm-ticker
```
```js
import {Ticker} from 'tm-ticker';
// or
const {Ticker} = require('tm-ticker');
```

&nbsp;

## Creation
### Constructor
```js
const myTicker = new Ticker(options = {});
```

### `options`
Type: `TickerOptions`

An object with the following properties:

* `interval: number` (optional)  
Milliseconds between ticks. **Must be greater than 50.**

* `tickHandler: function` (optional)  
The ticking callback function. Gets called on every tick.

* `tickOnStart: boolean` (default = true)  
By default, the first tick happens right on start, synchronously, before any timeout is set. Set `tickOnStart` to `false` if you want the first tick only after the first interval.

* `timeoutObj: {setTimeout, clearTimeout}` (default = globalThis)  
An object that implements both `setTimeout` and `clearTimeout` methods. Utilize this option when you want to base your ticker on alternative timeout methods ([read more](#timeoutobj)).

&nbsp;

`interval` and `tickHandler` can also be set after construction using the instance methods:
* `.setInterval(interval)`
* `.onTick(tickHandler)`

```js
const myTicker = new Ticker();

myTicker.setInterval(interval)

myTicker.onTick(tickHandler)
```

> There can be only one `tickHandler`. Setting a new tick handler will override the previous one.

&nbsp;

## Using the ticker
This part is very straight forward.

You have three main methods:
* `.start()`
* `.stop()`
* `.reset()`

and two *readOnly* properties:
* `isTicking`
* `timeToNextTick`

&nbsp;

For the following examples we'll use the same ticker that logs the word `"tick"` every second.
```js
const myTicker = new Ticker({
	interval: 1000,
	tickHandler: sayTick,
})
```

&nbsp;

### `.start()`
Start ticking. The `tickHandler` function will get called every `<interval>` milliseconds. If `tickOnStart` flag is set to `true` (default), `start` will also runs the first tick, before setting the first interval.  
When called after `.stop()` it functions as "resume", completing what's left of the interval that was stopped. There will be no start-tick in this case, regardless of `tickOnStart` state.


> NOTE: `.start()` will throw an error if called before setting an interval.



```js
myTicker.start()

/*
... 1000 ms
tick
... 1000 ms
tick
... 1000 ms
tick
...
*/
```

&nbsp;

### `.stop()`
Pause ticking. Saves the interval remainder so the next call to `.start()` will continue from where it stopped.

```js
myTicker.start()
// ... 3800 ms
myTicker.stop() // remainder = 200
// ...
myTicker.start() // resume

/*
... 200 ms
tick
... 1000 ms
tick
... 1000 ms
tick
...
*/
```

&nbsp;

### `.reset()`
Resets the ticker. Calling `.reset()` while ticking does not stop the ticker. It resets the ticking starting point.  
If `tickOnStart` flag is set to `true` (default), your `tickHandler` function will get called.  

Calling `.reset()` after a `.stop()` resets the `timeToNextTick` value to zero.

```js
myTicker.start()
// ... 3800 ms
myTicker.stop() // remainder = 200

myTicker.reset() // remainder = 0

myTicker.start()

/*
... 1000 ms
tick
... 1000 ms
tick
... 1000 ms
tick
...
*/
```

You can also do:
```js
myTicker.stop().reset();
```

&nbsp;

### `.isTicking`
ReadOnly boolean.  
Toggled by `.start()` and `.stop()` methods:
```js
console.log(myTicker.isTicking) // false

myTicker.start()

console.log(myTicker.isTicking) // true

myTicker.stop()

console.log(myTicker.isTicking) // false
```

&nbsp;

### `.timeToNextTick`
ReadOnly number.  
The number of milliseconds left to next tick. Resets to zero when `.reset()` is called.
```js
myTicker.start()
// ... 5800 ms
myTicker.stop()

console.log(myTicker.timeToNextTick); // 200
myTicker.reset()
console.log(myTicker.timeToNextTick); // 0
```


&nbsp;

## Synchronizing
The main methods, `start`, `stop` and `reset`, accepts an optional `timestamp` argument.
* `timestamp` - number, optional

That is the timestamp to be considered as the method's execution time. You can pass in a timestamp when you need to syncronize the ticker with other modules.

For example, let's say we're building a stopwatch module that is based on `Ticker`. Its `startCounting` method could be something like:
```js
FancyStopWatch.startCounting = () => {
	const startedAt = Date.now();

	// doing stuff that takes 50 milliseconds to complete...

	myTicker.start(startedAt);
}
```
Without passing the `startedAt` timestamp we would loose those 50ms and the first tick would happen 1000 + 50 ms after the user clicked that imaginery `START` button.
If, for whatever reason, we don't want to loose those precious milliseconds we can utilize the `timestamp` argument.

&nbsp;

## `timeoutObj`
By default, `Ticker` internally uses the global object's `setTimeout` and `clearTimeout` methods but sometimes we would want to use alternative methods.

You can provide an object that implements those two methods ([with the same argument signatures](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)) and be used by the ticker.

For example, let's say we want to use some kind of a `setTimeout-logger` that logs every timeout that the ticker sets. It looks like this:
```js
const myTimeoutLogger = {
	setTimeout (callback, ms, ...callbackArgs) {
		const ref = window.setTimeout(callback, ms, ...callbackArgs);

		console.log('Timeout is set');

		return ref;
	},

	clearTimeout: window.clearTimeout
}
```

To create a Ticker that uses our timeout-logger object we use the constructor's `timeoutObj` option:
```js
const myTicker = new Ticker({
	timeoutObj: myTimeoutLogger
});
```

&nbsp;

<!-- TODO: link, new name -->
Check out "`set-timeout-worker`". This npm module utilizes a dedicated web-worker for setting (and clearing) timeouts on a separate process. This makes timeouts more accurate and steady.

```js
import { timeoutWorker } from 'set-timeout-worker';

timeoutWorker.start();

const myTicker = new Ticker({
	timeoutObj: timeoutWorker
});
```

&nbsp;

## Benchmark
------------
Compares TM-Ticker against vanilla `setTimeout` / `setInterval`

> Run "`npm run dev`" first.

```sh
$ npm run benchmark
```

## Playground
-------------
> Run "`npm run dev`" first.
```sh
$ npm run playground
```
