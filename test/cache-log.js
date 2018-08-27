/**
 * cache-log (clog) is a simple async `console.log`
 * Using `console.log` when debugging timers (`setTimeout`/`setInterval`)
 * causes a delay.
 */

// a non-rounded number of ms to prevent race with (probably) rounded intervals
const DELAY = 1758;

let cacheLogs = [];
let ref = null;

function clog (...args) {
    cacheLogs.push(args);
    
    if (ref) {
        clearTimeout(ref);
    }

    ref = setTimeout(() => {
        console.log(cacheLogs);
        cacheLogs = [];
    }, DELAY);
}

module.exports = clog;
