'use strict';


const log = require('npmlog')

// 自定义 log 等级 判断debug模式
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
// 自定义 log 标题 前缀
log.heading = 'jkfe-cli'
// 自定义 log 标题 颜色
log.headingStyle = { fg: 'blue', bg: 'white' }

// 添加自定义命令
log.addLevel('success', 2000, { fg: 'green', bold: true })

// function index() {
//   log.success('cli', 'test')
// }

module.exports = log;
