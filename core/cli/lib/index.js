'use strict';

module.exports = core;

let args;
let pathExists, rootCheck;

// 外部模块
const colors = require('colors/safe')
const log = require('@jkfe-cli/log')
const path = require('path')
const sermver = require('semver')
const userHome = require('user-home')
// 内部模块
const constant = require('./const');
const pkg = require('../package.json')

async function core() {
  pathExists = await import('path-exists');
  rootCheck = await import('root-check');
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    checkGlobalUpdate()
  } catch (error) {
    log.error(error.message)
  }
}

async function checkGlobalUpdate() {
  // 1. 获取当前版本号和模块名
  // 2. 调用 npm API，获取所有版本号
  // 3. 提取所有版本号，比对哪些版本号是大于当前版本号
  // 4. 获取最新的版本号，提示用户更新到该版本
  const currentVersion = pkg.version
  const npmName = pkg.name
  const { getNpmSemverVersion } = require('@jkfe-cli/get-npm-info')
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
  if (lastVersion && sermver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
    更新命令：npm install -g ${npmName}`))
  }
}

function checkEnv () {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExists?.pathExistsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    })
  }
  createDefaultConfig()
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
  // return cliConfig
}

function checkInputArgs() {
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2))
  checkArgs(args)
}

function checkArgs(args) {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  // 更新 log.level
  log.level = process.env.LOG_LEVEL
}

async function checkUserHome() {
  const exist = pathExists?.pathExistsSync(userHome)
  if (!userHome || !exist) {
    log.error(colors.red('当前登录用户主目录不存在！'))
  }
}

// 检查 root 账户
async function checkRoot() {
  rootCheck?.default()
  // 打印当前用户
  // log.info('用户等级', process.geteuid())
}

// 检查node版本
function checkNodeVersion() {
  // 第一步: 获取当前node版本号
  const currentVersion = process.version
  // 第二步: 比对最低版本号
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION
  if (!sermver.gte(currentVersion, lowestNodeVersion)) {
    throw new Error(colors.red(`jkfe-cli 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`))
  }
}

// 检查脚手架版本
function checkPkgVersion() {
  log.notice('cli', pkg.version)
}