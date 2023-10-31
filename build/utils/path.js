import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

function getCurrentDirname(importMetaUrl) {
    return fileURLToPath(new URL('.', importMetaUrl));
}

const __dirname = getCurrentDirname(import.meta.url)

const rootDir = resolve(__dirname, '../../')

function resolveRootPath(...paths){
    return resolve(__dirname,rootDir,...paths)
}

const srcDir = resolveRootPath('src')
const buildDir = resolveRootPath('build')

export {
    rootDir,
    srcDir,
    buildDir,
    resolveRootPath,
    getCurrentDirname,
    resolve
}