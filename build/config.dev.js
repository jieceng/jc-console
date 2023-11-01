import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { rootDir } from './utils/path.js'
import path from 'node:path'


// out public dir
const publicDir  = 'lib'

// resovle public dir path
function resolvePublicPath(...paths){
  return path.resolve(rootDir, publicDir, ...paths)
}

// resolve current path
function resolveRootPath(...paths){
  return path.resolve(rootDir, ...paths)
}

// entry
const entry = resolveRootPath('src/index.ts');

// config

/**
 * @type {import('rollup'.RollupOptions)}
 */
const rollupOptions = [
  {
    input: entry,
    output: {
      file: resolvePublicPath('src/browser-console.js'),
      format: 'umd',
      name: 'BrowserConsole',
      sourcemap: 'inline'
    },
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
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: true,
          }
        }
      }),
      serve({
        open: true,
        openPage: '/example/index.html',
        host: 'localhost',
        port: 5501,
      }),
      livereload(),
    ],
    watch: {
      // 配置监听选项
      include: 'src/**',
      exclude: 'node_modules/**',
    },
  },
]

export default rollupOptions
