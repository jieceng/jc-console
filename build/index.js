import minimist from "minimist";
import { rollup, watch } from "rollup";
import { loadConfigFile } from "rollup/loadConfigFile";
import { buildDir } from "./utils/path.js";
import { resolve } from "node:path";
import PrettyError from "pretty-error";
import dayjs from "dayjs";
import chalk from "chalk";
const cliArgs = process.argv.slice(2);
const pe = new PrettyError();
const args = minimist(cliArgs);
const mode = args.mode || args.m;

async function build() {
  loadConfigFile(resolve(buildDir, "./config.dev.js")).then(
    async ({ options, warnings }) => {
      warnings.flush();
      try {
        for (const optionsObj of options) {
          const bundle = await rollup(optionsObj);
          await Promise.all(optionsObj.output.map(bundle.write));
        }

        const watcher = watch(options);
        watcher.on("event", (event) => {
          switch (event.code) {
            case "START": {
              // console.log('监视器正在（重新）启动');
              break;
            }
            case "BUNDLE_START": {
              // console.log('单次打包');
              break;
            }
            case "BUNDLE_END": {
              // console.log('打包完成');
              break;
            }
            case "END": {
              // console.log('完成所有打包的构建')
              break;
            }
            case "ERROR": {
              console.log(pe.render(event.error));
            }
          }
        });
        watcher.on("event", ({ result }) => {
          if (result) {
            result.close();
          }
        });
        watcher.on("change", (id) => {
          console.log(
            (`${dayjs().format("HH:mm:ss")} ${chalk.green('change')} ${id}`)
          );
        });
        watcher.on("restart", () => {

        });
        watcher.on("close", () => {
          
        });

        // 停止监听
        watcher.close();
      } catch (error) {
        watcher.close();
        console.log(pe.render(error));
      }
    }
  );
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
