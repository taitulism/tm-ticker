export const getNow = () => Date.now();

export function memoize (fn: () => void) {
	const memo = Object.create(null);

	return function memoFn (...args: Array<any>) {
		if (!memo[args]) {
			memo[args] = fn(args);
		}

		return memo[args];
	};
}
