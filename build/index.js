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
const mode = args.mode || args.m || "development";
const isWatch = args.watch || args.w || false
process.env.NODE_ENV = mode;

function buildWatch(options) {
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
  function debounce(fn, time=100){
    let timer = null
    return  function(...arg){
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(this, arg)
      }, time)
    }
  }
  watcher.on("change",debounce((id) => {
    console.log(`${dayjs().format("HH:mm:ss")} ${chalk.green("change")} ${id.replace(/\\/g, '/')}`);
  }));
  watcher.on("restart", () => {
    // console.log('restart')
  });
  watcher.on("close", () => {});
  // 停止监听
  watcher.close();
}

async function build() {
  loadConfigFile(resolve(buildDir, `./config.js`)).then(
    async ({ options, warnings }) => {
      warnings.flush();
      try {
        for (const optionsObj of options) {
          const bundle = await rollup(optionsObj);
          await Promise.all(optionsObj.output.map(bundle.write));
        }
        isWatch && buildWatch(options)
      } catch (error) {
        console.log(pe.render(error));
      }
    }
  );
}

// 调用build函数执行打包
build();
