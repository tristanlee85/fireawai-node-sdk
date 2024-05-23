import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const config = [
  // ESM build
  {
    input: 'src/index.mjs',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      terser(),
    ],
  },
  // CJS build
  {
    input: 'src/index.mjs',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    plugins: [
      resolve(),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
      terser(),
    ],
  },
];

export default config;
