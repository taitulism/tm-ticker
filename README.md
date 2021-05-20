# TM-Ticker
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/tm-ticker.svg?branch=master)](https://travis-ci.org/taitulism/tm-ticker)

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



## TL;DR
[Jump to API](#api)

#### Create:
```js
// construct & config
const t = new Ticker(interval, callback, tickOnStart = true)

// or just construct (and config later)
const t = new Ticker()
```


#### Config:
```js
t.tickOnStart = bool // deafult: true
t.setInterval(number)
t.setCallback(fn)
t.set(interval, callback)
```


#### Use:
> `now` is optional
```js
 t.start(now)
```
```js
 t.getTimeLeft(now)
```
```js
 t.stop(now)
```
```js
 t.reset(now)
```
```js
 t.destroy()
```


## API
------

## Constructor
```js
new Ticker(interval, callback, tickOnStart);
```
* `interval` [number, optional]  
Milliseconds between ticks. Must be greater than 50.

* `callback` [function, optional]  
Tick handler function. Gets called on every tick.

* `tickOnStart` [boolean, optional, default: `true`]  
By default, the first tick happens on start, synchronously, before any timeout. Set to `false` if you want the first tick to happen only after the first interval.


## Configuration
A Ticker instance won't tick unless it has an interval and a tick callback.  
You can do it on construction or later with the following methods which are very self explanatory:

```js
const myTicker = new Ticker();

myTicker.setInterval(1000)
myTicker.setCallback(myFunc)
myTicker.set(1000, myFunc)

// default is true.
myTicker.tickOnStart = false
```

You can also set the `interval` & `callback` directly as props but this way bypasses type validation for both and min number validation for `interval` (should be greater than *50*ms).
```js
myTicker.interval = 1000
myTicker.callback = myFunc
```

## Methods
All methods can get called with a `timestamp` argument. Pass in a current timestamp when you need to sync time with other modules.

* `timestamp` (ms, number, optional) - The timestamp to be considered as the method's execution time.

## .start()
Start ticking.

If `tickOnStart` is set to `true` (default behavior), your callback will get called on start (as opposed to only after the first interval)

When called after a `.stop()` it acts as a "resume" function. There will be no start-tick in this case. The next tick is calculated based on the `timeLeft` record.

```js
// optional
const timestamp = Date.now()

myTicker.start(timestamp)
```


## .getTimeLeft()
Returns how many milliseconds left to next tick.

```js
const myTicker = new Ticker(1000, callback)

myTicker.start()

// after about two ticks and a half (2480ms)
myTicker.getTimeLeft() // --> 520
```


## .stop()
Stop/Pause ticking.

When called, the Ticker instance calculates the time left to next tick and stores it on a `timeLeft` prop in case you'll want to resume ticking from exact same point.  
Run `.start()` to resume.  

```js
const myTicker = new Ticker(1000, sayTick)

myTicker.start() // TICK!

// Time passes by.. TICK!.. TICK!..
myTicker.stop()

console.log(myTicker.timeLeft) // 680 (ms left to next tick)

// resume
myTicker.start() // next tick in 680ms.
```


## .reset()
Reset the ticker. 

>Reseting a ticker doesn't change its initial interval.

Can be called whether the ticker is running or not:
* When running: Restart as if you have just started. Doesn't stop the ticker.
* When stopped: Reset the recorded `timeLeft`.

```js
const myTicker = new Ticker(1000, sayTick)

myTicker.start() // new start point
myTicker.reset() // new start point. still running...
myTicker.stop() // save `timeLeft`

myTicker.start() // resume from the same point
myTicker.stop()  // save `timeLeft`
myTicker.reset() // reset `timeLeft`

myTicker.start() // new start point
```

## .destroy()
Destroy the ticker.

Calls `.stop()` and  `.reset()` and set the `.isDestroyed` prop to `true`.  

> *To use the same Ticker instance again, `isDestroyed` should be set to `false`.*

```js
const myTicker = new Ticker(1000, sayTick)

myTicker.start()
myTicker.destroy()

// Resurrection
myTicker.isDestroyed = false;

myTicker.start()
```

## Playground / benchmark
-------------------------
Compares Ticker with using vanilla `setTimeout` & `setInterval`
```sh
$ npm run playground
```
