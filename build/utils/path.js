import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

function getCurrentDirname(importMetaUrl) {
    return fileURLToPath(new URL('.', importMetaUrl));
}

const __dirname = getCurrentDirname(import.meta.url)

// 项目根路径
const rootDir = resolve(__dirname, '../../')

// 源码目录
const srcDir = resolveRootPath('src')

// 打包目录
const buildDir = resolveRootPath('build')

function resolveRootPath(...paths){
    return resolve(__dirname,rootDir,...paths)
}

export {
    rootDir,
    srcDir,
    buildDir,
    resolveRootPath,
    getCurrentDirname,
    resolve
}