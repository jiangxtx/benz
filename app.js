/* eslint @typescript-eslint/no-var-requires: 0 */
/**
 * @file app.js, 用来生成express app
 * @author jiangxtx
 */

const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('@benz/use-helmet')

const app = express()
const routes = require('./src/routes')

app.set('trust proxy', true)
app.use(cookieParser())

configAppEngine(app)
/* 使用helmet(涉及到xss攻击和其他的一些安全选项) */
helmet(app)
/* 整个项目的路由挂载（多路由多页面模式） */
routes(app)

module.exports = app

/**
 * 配置app模板
 * @param {*} app
 */
function configAppEngine(app) {
  if (app.get('env') === 'development') {
    app.set('view cache', false)
  }

  // jsx engine
  app.set('view engine', 'jsx')
  app.get('view').prototype.lookup = function () {
    return this.name
  }
  app.engine('jsx', require('src/config/jsxViewEngine')())
}
