import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import scss from 'rollup-plugin-scss';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'Galerie',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find imported modules
			commonjs(), // so Rollup can convert imported modules to an ES module
			babel({
				// prevent circular dependencies
				exclude: 'node_modules/**'
			}), // transpilation
			terser(), // minification
			scss() // will output compiled styles to output.css
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: ['@glidejs/glide'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
	},
];
