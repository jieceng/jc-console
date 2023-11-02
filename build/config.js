import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import alias from "@rollup/plugin-alias";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { rootDir } from "./utils/path.js";
import path from "node:path";
import terser from "@rollup/plugin-terser";

const env = process.env.NODE_ENV;

// out public dir
const publicDir = "lib";

// resovle public dir path
function resolvePublicPath(...paths) {
  return path.resolve(rootDir, publicDir, ...paths);
}

// resolve current path
function resolveRootPath(...paths) {
  return path.resolve(rootDir, ...paths);
}

// entry
const entry = resolveRootPath("src/index.ts");

// plugin
const commonPlugins = [
  resolve({
    extensions: [".js", ".ts"],
  }),
  commonjs(),
  alias({
    entries: [{ find: /^@\//, replacement: path.join(rootDir, "src/") }],
  }),
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: true,
      },
    },
  }),
];

/**
 * @type {import('rollup'.RollupOptions)}
 */
const rollupOptions = [
  {
    input: entry,
    output:
      env === "development"
        ? {
            file: resolvePublicPath("src/jc-console.js"),
            format: "umd",
            name: "JcConsole",
            sourcemap: "inline",
          }
        : [
            {
              file: resolvePublicPath("src/jc-console.cjs.prod.js"),
              format: "cjs",
              name: "JcConsole",
            },
            {
              file: resolvePublicPath("src/jc-console.umd.prod.js"),
              format: "umd",
              name: "JcConsole",
            },
            {
              file: resolvePublicPath("src/jc-console.es.prod.js"),
              format: "es",
              name: "JcConsole",
            },
            {
              file: resolvePublicPath("src/jc-console.iife.prod.js"),
              format: "iife",
              name: "JcConsole",
            },
          ],
    plugins:
      env === "development"
        ? [
            ...commonPlugins,
            serve({
              open: false,
              openPage: "/example/index.html",
              host: "localhost",
              port: "5009",
            }),
            livereload(),
          ]
        : [...commonPlugins, terser()],
    watch: {
      // 配置监听选项
      include: "src/**",
      exclude: [
        "node_modules/**",
        "build/**",
        "lib/**"
      ],
    },
  },
];
if (env === "prodcution") {
  rollupOptions.push({
    input: entry,
    output: [{ file: resolvePublicPath("types/index.d.ts"), format: "esm" }],
    plugins: [dts()],
  });
}

export default rollupOptions;
