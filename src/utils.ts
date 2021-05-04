import { UnknownArgs, UnknownFn } from './types';

export const getNow = () => Date.now();

export function memoize (fn: UnknownFn): UnknownFn {
	const memo = new Map<UnknownArgs, unknown>();

	return function memoFn (...args: UnknownArgs): unknown {
		if (memo.has(args)) return memo.get(args);

		const results = fn(args);

		memo.set(args, results);

		return results;
	};
}
