# Ticker
**PROJECT STATUS:** Just got started. Work in progress...  
**CURRENT VERSION:** `0.0.0`  
**FOLLOWS SEMVER:** Not yet.  
**DEFAULT BRANCH:** `develop`  

## Ticker
An accurate interval Ticker class.  
Based on a self-fixing `setTimeout` function.  
* Accuracy: ~2ms
* Minimal Interval Limit: 100ms

## Installation
> **Work in progress...**
```js
import Ticker from 'Ticker';
// or
const Ticker = require('Ticker);
```

## Usage
### TL;DR
[Jump to API](#api)

Create:
```js 
t = new Ticker(interval, callback)
```
Use:
```js
 t.start(now, skipStartTickFlag)
```
```js
 t.stop(now)
```
```js
 t.reset(now)
```


### Why?
Timing in javascript is inaccurate.

RAF (requestAnimationFrame) is really great but Node doesn't have it and browsers tend to pause it when you leave the tab (no rendering = freeze ticker).

When you try to create a ticker with a simple recursive `setTimeout` you will have a small "time leak" because each tick runs a few ms after the original interval and this will accumulate over time.

Using `setInterval` raises another issue: when your callback runtime is higher than the interval iteself, the next callback will start running before the previous callback has finished and you'll soon get out of memory.

So running a function every constant ms isn't trivial.

> ***Calculating time takes time!***

### How Ticker works internally?
Ticks have their ideal timestamp which is when exactly would they run in a perfect world. Something like:  
```js
// in a perfect world PSEUDO code:
nextTickIdealTime = previousTickIdealTime + interval
```

Ticker uses a "meta tick" before your ideal tick's timestamp. A meta-tick is timed to **26ms** before each tick. Let's say your interval is 1000ms (1 second). Ticker will set a meta-tick at 974ms. This tick actual timestamp would be greater (e.g. 986).

Then Ticker checks the time left to the tick (e.g. 14ms), if it is less than or equal to **12ms** (which means a great delay, unlikely to happen) it will run your callback, considering system is very busy so let's not use an extra tiny interval. The human eye will not notice a one time 12ms glitch.

If there is enough time Ticker will set your callback to run **5ms** before time, taking into account self runtime and a minor expected delay.

In fact, each tick is timed about **5ms** before its ideal timestamp. This makes the ticks keep the same offset (normally between 5ms to 3ms before ideal time, mostly 4ms) so the interval (e.g. 1000) remains accurate.

## API

## Constructor

```js
// Both arguments are required*.
new Ticker(interval, callback);
```
* `interval` (number, required) - Milliseconds between ticks. Must be greater than 100.
* `callback` (function, required) - Tick handler function ("onTick").  
    &nbsp; &nbsp; &nbsp; called with:  
    * `timestamp` - The calculated tick's timestamp (rounded to interval).  
    >This is not the real tick's timestamp but the ideal timestamp based on your start time and interval.

Example:
```js
const myTicker = new Ticker(1000, (now) => {
    console.log('TICK', now);
});
```



## .start()
Start ticking. The first tick happens on start, synchronously, before any timeout. You can pass in a current timestamp. Use this when you need to keep in sync with another piece of code.
```js
myTicker.start(timestamp);
```
* `timestamp` (number, optional) - The timestamp to be considered as start time.

Example:
```js
const now = Date.now();

myTicker.start(now);
// or
myTicker.start();
```



## .stop()
Stop ticking. It is actually a "Pause" function because the stop time is recorded for when you start again (unless you call `.reset()`)
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
Reset the ticker. Can be called whether the ticker is active or not. If called when active it will perform a "stop-reset-start" and you'll get a start tick ([see above](#start)). If called when the ticker is inactive (stopped) it will reset the recorded "paused timestamp" if exists. Reseting a ticker doesn't change its initial interval.
```js
myTicker.reset(timestamp);
```
* `timestamp` (number, optional) - The timestamp to be considered as stop time.

```js
const now = Date.now();

myTicker.reset(now);
// or
myTicker.reset();
```




