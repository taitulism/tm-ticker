# Just got started. Work in progress...

## Ticker
An interval Ticker class. Done with an auto-self-fixing `setTimeout` function.  
Currently the minimal interval is 100ms (10 times in 1 second).

### Why?
Timing in js is inaccurate.

RAF (requestAnimationFrame) is really great but browsers tend to pause it when you leave the tab (no rendering = freeze ticker).

When you try to create a ticker with a simple recursive `setTimeout` you will have a small "time leak" because each tick runs a few ms after the original interval and this will accumulate over time.

Using `setInterval` raises another issue: when your callback runtime is higher than the interval iteself, the next callback will start running before the previous callback has finished and you'll soon get out of memory.

### How this Ticker works internally?
> **Given numbers below will probably change after a deeper research.**

Ticker uses a "meta tick" before your tick. A meta-tick is timed to **50ms** before each tick. Let's say your interval is 1000ms (1 second). Ticker will set a meta-tick at 950ms. This tick actual timestamp would be greater than 950 (e.g. 964).

Then Ticker checks the time left to the tick (e.g. 36ms), if it is less than or equal to **12ms** (which means a great delay, unlikely to happen) it will run your callback, considering system is very busy so let's not use extra interval. The human eye will not notice.  
If there is enough time Ticker will set your callback to occure **5ms** before time, taking into account self runtime and a minor expected delay.

In fact, each tick it timed about **5ms** before its original absolute timestamp. This makes the first tick be about ~4ms shorter but the following ticks keeps the same offset so the interval remains accurate (about ~2ms) after the first tick.



```js
const callback = (nowMs, originalTargetTime) => {
    console.log(`*** TICK ***`);
};

const myTicker = new Ticker(100, callback);

myTicker.start();

/*
    // Somewhere down the road:
    myTicker.pause();
*/
```
