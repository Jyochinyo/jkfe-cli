'use strict';

module.exports = core;

let args;

// 外部模块
const colors = require('colors/safe')
const log = require('@jkfe-cli/log')
const sermver = require('semver')
const userHome = require('user-home')
// 内部模块
const constant = require('./const');
const pkg = require('../package.json')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    log.verbose('cli', 'test verbose')
  } catch (error) {
    log.error(error.message)
  }
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
  // path-exists 版本过高 不支持require
  const pathExists = await import('path-exists')
  const exist = pathExists?.pathExistsSync(userHome)
  if (!userHome || !exist) {
    throw new Error(colors.red('当前登录用户主目录不存在！'))
  }
}

// 检查 root 账户
async function checkRoot() {
  // root-check 版本过高 不支持require
  const rootCheck = await import('root-check')
  rootCheck?.default()
  // 打印当前用户
  // log.info('cli', process.geteuid())
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