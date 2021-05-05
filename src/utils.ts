// import { UnknownArgs, UnknownFn } from './types';

export const getNow = () => Date.now();

export function memoize<Args extends Array<unknown>, Return> (
	fn: (...args: Args) => Return
): (...args: Args) => Return {
	const memo = new Map<Args, Return>();

	return function memoFn (...args: Args): Return {
		if (memo.has(args)) return memo.get(args)!;

		const results = fn(...args);

		memo.set(args, results);

		return results;
	};
}
