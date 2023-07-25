'use strict';

module.exports = core;

const sermver = require('semver')
const colors = require('colors/safe')
const pkg = require('../package.json')
const log = require('@jkfe-cli/log')
const constant = require('./const')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
  } catch (error) {
    log.error(error.message)
  }
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