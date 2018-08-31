# tm-ticker
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/ticker.svg?branch=develop)](https://travis-ci.org/taitulism/ticker)

An interval ticker class (no GUI).  

## Installation
```sh
$ npm install tm-ticker
```
```js
import Ticker from 'tm-ticker';
// or
const Ticker = require('tm-ticker');
```



## Usage
[Jump to API](#api)

### tl;dr

Create:
```js 
t = new Ticker(interval, callback, tickOnStart)
```
Use:
```js
 t.start(now)
```
```js
 t.stop(now)
```
```js
 t.reset(now)
```



### Why?
Timing in javascript is inaccurate.

When you try to create a ticker with a simple recursive `setTimeout` you will have a small "time leak" because each tick runs a few ms after the original interval and this will accumulate over time. If you'll compare, side by side, that kind of a ticker with an actual clock/stopwatch you'll notice a growing offset.

Using `setInterval` raises another issue: when your callback run time is higher than the interval iteself, the next callback will be called before the previous one has finished and you'll soon get out of memory.

`requestAnimationFrame` is really great but Node doesn't have it and browsers tend to pause it when you leave the tab (no rendering = freeze ticker? what about sound?).

So running a function every constant ms isn't trivial.


## API

## Constructor

```js
// First two arguments are required.
new Ticker(interval, callback, tickOnStart);
```
* `interval` (number, required) - Milliseconds between ticks. Must be greater than 50.

* `callback` (function, required) - Tick handler function ("onTick").

* `tickOnStart` (boolean, optional, default: `true`) - By default, the first tick happens on start, synchronously, before any timeout. Set to `false` if you want the first tick to happen only after the first interval.

Example:
```js
const myTicker = new Ticker(1000, () => {
    console.log('TICK');
}, false);
```

## .start()
You can pass in a current timestamp. Use this when you need to keep in sync with another piece of code.
```js
myTicker.start(timestamp);
```
* `timestamp` (number, optional) - The timestamp to be considered as start time. Use it when you need to sync times with other modules.

Example:
```js
const now = Date.now();

myTicker.start(now);
// or
myTicker.start();
```



## .stop()
It is actually a "Pause" function because the stop time is recorded for when you start again (unless you also call `.reset()`)
```js
myTicker.stop(timestamp);
```
* `timestamp` (number, optional) - The timestamp to be considered as stop time.

Example:
```js
const now = Date.now();

myTicker.stop(now);
// or
myTicker.stop();
```



## .reset()
Reset the ticker. Can be called whether the ticker is running or not. If called when running it will perform a quick `stop-reset-start`. If called when the ticker is not running (after a `.stop()`) it will reset the recorded "paused timestamp" if exists. Reseting a ticker doesn't change its initial interval.
```js
myTicker.reset(timestamp);
```
* `timestamp` (number, optional) - The timestamp to be considered as the reset time (and passed to the new `.start(timestamp)` call)

```js
const now = Date.now();

myTicker.reset(now);
// or
myTicker.reset();
```


## Playground / benchmark
```sh
$ npm run playground
```

