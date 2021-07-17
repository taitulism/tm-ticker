/* eslint-disable */

import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
	input: 'src/Ticker.ts',
	plugins: [nodeResolve(), typescript()],
	output: [{
		file: 'dev-bundles/tm-ticker.js',
		format: 'cjs',
		sourcemap: true,
		name: 'TickerModule',
	}],
}, {
	input: 'tests/index.spec.ts',
	plugins: [nodeResolve(), commonjs(), typescript()],
	output: {
		file: 'dev-bundles/tm-ticker-spec.js',
		sourcemap: true,
		format: 'iife',
	},
	onwarn (warning, rollupWarn) {
		if (warning.code !== 'CIRCULAR_DEPENDENCY' && warning.code !== 'EVAL') {
			rollupWarn(warning);
		}
	},
}, {
	input: 'playground/playground.ts',
	plugins: [nodeResolve(), commonjs(), typescript()],
	output: {
		file: 'dev-bundles/playground.js',
		sourcemap: true,
		format: 'iife',
	},
	onwarn (warning, rollupWarn) {
		if (warning.code !== 'CIRCULAR_DEPENDENCY' && warning.code !== 'EVAL') {
			rollupWarn(warning);
		}
	},
}];
