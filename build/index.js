import minimist from "minimist";
import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";
import { rollup } from "rollup";
import PrettyError from "pretty-error";
import { buildDir } from "./utils/path.js";
import { resolve } from "node:path";
import prodConfig from "./config.prod.js";
const cliArgs = process.argv.slice(2);

const args = minimist(cliArgs);
const mode = args.mode || args.m;
const pe = new PrettyError();

// args transformat
function argsToExeca() {
  return cliArgs.reduce((last, next) => {
    if (next.indexOf("mode") !== -1) return last;
    last.push(...next.split("="));
    return last;
  }, []);
}

async function build() {
  const spinner = ora("开始打包").start();
  const startTime = +new Date();
  try {
    for (const config of prodConfig) {
      // 创建Rollup bundle
      const bundle = await rollup(config);
      for (const out of config.output) {
        // 根据配置生成输出文件
        await bundle.write(out);
      }
      // 结束当前配置的打包过程
      await bundle.close();
    }
    const endTime = +new Date();
    spinner.succeed(chalk.green(`打包成功: ${endTime - startTime}ms`));
  } catch (e) {
    console.error(pe.render(e));
    spinner.fail(chalk.red("打包失败, 请检查上述错误描述"));
  }
}

// 调用build函数执行打包
build();

// start
// async function bootstart() {
//   const spinner = ora('开始打包').start();
//   const startTime = (+new Date())
//   try {
//     const configPath = resolve(
//       buildDir,
//       `config.${mode === "production" ? "prod" : "dev"}.js`
//     );
//     const rollupArgs = ["-c", resolve(buildDir, configPath),...argsToExeca()];
//     let res = await execa("rollup", rollupArgs);
//     console.log(res.stderr)
//     const endTime = (+new Date())
//     spinner.succeed(chalk.green(`打包成功: ${endTime-startTime}ms`));
//   } catch (e) {
//     console.error(pe.render(e));
//     spinner.fail(chalk.red("打包失败, 请检查上述错误描述"));
//   }
// }
