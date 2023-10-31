import ConmonRollupConfig from './common.js'
import merge from 'rollup-merge-config'
import terser from '@rollup/plugin-terser';

/**
 * @type {import('rollup'.RollupOptions)}
 */
const rollupOptions = merge(
  {
    plugins: [
      terser()
    ],
  }, ConmonRollupConfig[0]);


export default [
  rollupOptions,
  ConmonRollupConfig[1]
]
