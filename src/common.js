const getNow = () => Date.now();

function memoize (fn) {
	const memo = Object.create(null);

	return function memoFn (...args) {
		if (!memo[args]) {
			memo[args] = fn(args);
		}

		return memo[args];
	};
}

module.exports.getNow = getNow;
module.exports.memoize = memoize;
