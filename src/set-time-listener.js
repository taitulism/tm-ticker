// Default values
const META_TICK = 12;
const TIME_MARGIN = 2;
const META_THRESHOLD = (META_TICK * 2) + TIME_MARGIN; // 26
const MIN_TIME_LEFT = (META_TICK / 4); // 3
const ZERO = 0;
const TIME_PASSED = -1;

module.exports = setTimeListener;

function setTimeListener (target, callback) {
    let ref;
    const timeLeft = getTimeLeft(target);

    if (timeLeft <= META_THRESHOLD) {
        /**
         * Using `setTimeListener` for such a short time period is an overhead.
         */

        if (timeLeft <= TIME_MARGIN) {
            // No time for setTimeout. Run callback now.
            callback();
            ref = null;
        }
        else {
            // No time for a metaTick. Just pad and run.
            const ms = timeLeft - TIME_MARGIN;

            ref = setTimeout(() => {
                callback(target);
            }, ms);
        }
    }
    else {
        ref = setMetaTick(target, callback, timeLeft);
    }
    
    return function clearTimeListener () {
        clearTimeout(ref);
    };
}

function setMetaTick (target, callback, timeLeft) {
    const ms = timeLeft - META_TICK;

    return setTimeout(() => {
        runMetaTick(target, callback);
    }, ms);
}

function runMetaTick (target, callback) {
    const ms = calcTimeout(target);

    if (ms < ZERO) {
        callback();
    }
    else {
        // TODO: This setTimeout cannot be cleared (time scope)
        setTimeout(() => {
            callback();
        }, ms);
    }
}

function calcTimeout (target) {
    const timeLeft = getTimeLeft(target);

    if (timeLeft <= MIN_TIME_LEFT) { // means a great delay 
        return TIME_PASSED; // negative value means run the callback now (synchronously).
    }

    const delay = META_TICK - timeLeft;
    
    if (delay <= TIME_MARGIN) {
        return timeLeft - TIME_MARGIN;
    }
    
    // Miror the delay
    return timeLeft - delay;
}

function getTimeLeft (target, now = Date.now()) {
    return target - now;
}



