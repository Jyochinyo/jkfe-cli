'use strict';

module.exports = core;

const pkg = require('../package.json')
const log = require('@jkfe-cli/log')

function core() {
  checkPkgVersion()
}

// 检查版本
function checkPkgVersion() {
  log.notice('cli', pkg.version)
}