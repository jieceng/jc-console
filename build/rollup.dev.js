import typescript from 'rollup-plugin-typescript2';
import ConmonRollupConfig from './common.js'
import merge from 'rollup-merge-config'


/**
 * @type {import('rollup'.RollupOptions)}
 */
const rollupOptions = merge(
  {
    plugins: [

    ],
  }, ConmonRollupConfig[0]);


export default [
  rollupOptions,
  ConmonRollupConfig[1]
]
