/* eslint-disable */

import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
	input: 'src/Ticker.ts',
	plugins: [nodeResolve(), typescript()],
	output: {
		file: 'dev-bundles/tm-ticker.js',
		format: 'iife',
		sourcemap: true,
		name: 'Ticker',
	},
}, {
	input: 'tests/index.spec.ts',
	plugins: [nodeResolve(), commonjs(), typescript()],
	output: {
		file: 'dev-bundles/tm-ticker-spec.ts',
		sourcemap: true,
		format: 'iife',
	},
	onwarn (warning, rollupWarn) {
		if (warning.code !== 'CIRCULAR_DEPENDENCY' && warning.code !== 'EVAL') {
			rollupWarn(warning);
		}
	},
}];
