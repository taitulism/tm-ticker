# TM-Ticker
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/tm-ticker.svg?branch=master)](https://travis-ci.org/taitulism/tm-ticker)

An accurate interval ticker class.  

&nbsp;

## TL;DR
```js
const myTicker = new Ticker(1000, tickHandler);

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
import Ticker from 'tm-ticker';
// or
const Ticker = require('tm-ticker');
```

&nbsp;

## Creation & Setup
### Constructor
```js
const myTicker = new Ticker(interval, tickHandler, tickOnStart = true);
```
* `interval` [number]  
Milliseconds between ticks. **Must be greater than 50.**

* `tickHandler` [function]  
Ticking callback function. Gets called on every tick.

* `tickOnStart` [boolean] optional  
By default, the first tick happens right on start, synchronously, before any timeout is set. Set `tickOnStart` to `false` if you want the first tick to happen only after the first interval.


<!-- TODO: default interval -->
A Ticker instance won't tick unless it has an interval and a tick Handler.  

&nbsp;

It is also possible to instantiate a Ticker with no arguments and set them later using the following methods:
* `.set(interval, tickHandler)`
* `.setInterval(interval)`
* `.onTick(tickHandler)`

```js
const myTicker = new Ticker();

myTicker.set(interval, tickHandler)
```
or separately:
```js
const myTicker = new Ticker();

myTicker.setInterval(interval);
myTicker.onTick(tickHandler);
```

> There can be only one `tickHandler`. Setting a new handler by calling `.onTick(tickHandler)` again will override the previous one.

The constructor also accepts a third argument, `tickOnStart` (boolean, default is `true`).  
This boolean controls the first tick behavior. When `true` (default), the first tick happens right on start, synchronously. When `false`, first tick will only happen after `<interval>` milliseconds since start. You can also set it after construction:
```js
const myTicker = new Ticker();

myTicker.tickOnStart = false;
```

&nbsp;

## Using the ticker
This part is very straight forward.

You have three main methods:
* `.start()`
* `.stop()`
* `.reset()`

and two properties:
* `isTicking`
* `timeToNextTick`

&nbsp;

For the following examples we'll use the same ticker that logs the word `"tick"` every second.
```js
const myTicker = new Ticker(1000, sayTick)
```

&nbsp;

## Main Methods
The main methods, `start`, `stop` and `reset`, accepts an optional `timestamp` argument.
* `timestamp` - number, optional

That is the timestamp to be considered as the method's execution time. You can pass in a timestamp when you need to syncronize the ticker with other modules.

For example, let's say we're building a stopwatch module that uses a ticker. Its `startCounting` method could be something like:
```js
FancyStopWatch.startCounting = () => {
	const startedAt = Date.now();

	// doing stuff...

	// stuff took 50ms to complete

	myTicker.start(startedAt);
}
```
Without passing the `startedAt` timestamp we would loose those 50ms and the first tick would happen 1000 + 50 ms after the user clicked that imaginery `START` button.
If, for whatever reason, we don't want to loose those precious milliseconds we can utilize the `timestamp` argument.

&nbsp;

### `.start()`
Start ticking. The `tickHandler` function will get called every `<interval>` milliseconds.  
When called after `.stop()` it acts as a "resume" function. There will be no start-tick in this case.

If the `tickOnStart` flag was set to `true` (default), your `tickHandler` function will get called right on start. See `tickOnStart`. <!-- TODO: link -->


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
Stop/Pause ticking. It also saves the interval remainder so the next call to `.start()` will continue from where it stopped.

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

### `.reset()`
Resets the ticker.
Calling `.reset()` while ticking does NOT stop the ticker. It does set the ticking starting point to when it was called, as if you have just started. In case the `tickOnStart` flag is set to `true` (default), your `tickHandler` function will get called.  

Calling `.reset()` after the ticker was stopped resets the `timeToNextTick` value to zero.

>Reseting a ticker does NOT clear the `interval` nor unbinds the `tickHandler` callback.

```js
myTicker.start()
// ... 3800 ms
myTicker.stop() // remainder = 200

myTicker.reset() // remainder = 0
// ...
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

### `.timeToNextTick`
ReadOnly number.  
The number of milliseconds left to next tick. Resets to zero when `.reset()` is called.
```js
myTicker.start()
// ... 3800 ms
myTicker.stop()

console.log(myTicker.timeToNextTick); // 200
myTicker.reset()
console.log(myTicker.timeToNextTick); // 0
```

&nbsp;

<!-- TODO: check if works -->
## Playground / benchmark
-------------------------
Compares Ticker with using vanilla `setTimeout` & `setInterval`
```sh
$ npm run playground
```
