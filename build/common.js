import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import { rootDir } from './utils/path.js'
import path from 'node:path'


// out public dir
const publicDir  = 'lib'

// resovle public dir path
function resolvePublicPath(...paths){
  return path.resolve(rootDir, publicDir, ...paths)
}

// resolve current path
function resolvePath(...paths){
  return path.resolve(rootDir, ...paths)
}

// entry
const entry = resolvePath('src/index.ts');

// config

/**
 * @type {import('rollup'.RollupOptions)}
 */
const rollupOptions = [
  {
    input: entry,
    output: [
      {
        file: resolvePublicPath('src/bundle.cjs.js'),
        format: 'cjs',
        name: 'BrowserConsole',
      },
      {
        file: resolvePublicPath('src/bundle.umd.js'),
        format: 'umd',
        name: 'BrowserConsole',
      },
      {
        file: resolvePublicPath('src/bundle.es.js'),
        format: 'es',
        name: 'BrowserConsole',
      },
      {
        file: resolvePublicPath('src/bundle.iife.js'),
        format: 'iife',
        name: 'BrowserConsole',
      },
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.ts'],
      }),
      commonjs(),
      alias({
        entries: [
          { find: /^@\//, replacement:  path.join(rootDir, 'src/')}, 
        ]
      }),
      typescript({
        useTsconfigDeclarationDir: true
      }),
    ],
  },
  {
    input: entry,
    output: [{ file: resolvePublicPath('types/index.d.ts'), format: "esm" }],
    plugins: [dts()],
  },
]

export default rollupOptions
