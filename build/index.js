import minimist from "minimist";
import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";
import PrettyError from "pretty-error";
import { buildDir } from "./utils/path.js";
import { resolve } from "node:path";
const cliArgs = process.argv.slice(2);

const args = minimist(cliArgs);
const mode = args.mode || args.m;
const pe = new PrettyError();

// args transformat
function argsToExeca(){
  return cliArgs.reduce((last, next)=>{
    if(next.indexOf('mode')) return last
    last.push(...next.split('='));
    return last;
  },[])
}


// start
async function bootstart() {
  const spinner = ora('开始打包').start();
  const startTime = (+new Date())
  try {
    const configPath = resolve(
      buildDir,
      `config.${mode === "production" ? "prod" : "dev"}.js`
    );
    let res = await execa("rollup", ["-c", resolve(buildDir, configPath),...argsToExeca()]);
    console.log(res.stderr)
    const endTime = (+new Date())
    spinner.succeed(chalk.green(`打包成功: ${endTime-startTime}ms`));
  } catch (e) {
    console.error(pe.render(e));
    spinner.fail(chalk.red("打包失败, 请检查上述错误描述"));
  }
}

bootstart();
