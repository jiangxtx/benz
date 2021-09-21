/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint no-console: 0 */
const express = require('express')
const path = require('path')
const gulp = require('gulp')
const fs = require('fs-extra')
const webpackCli = require('./node_modules/webpack')

const OUTPUT_PATH = './dist/'
const REACT_SERVER_DIST = './dist/server/'
const NODE_VIEW_DIST_DIR = './dist/views'

const webpackRun = function (webpackConfig, callback) {
  const compiler = webpackCli(webpackConfig)
  compiler.run(function (error) {
    if (!error) {
      callback && callback()
    } else {
      throw error
    }
  })
}

gulp.task('clean', function (done) {
  fs.removeSync(OUTPUT_PATH)
  fs.removeSync('.cache-loader/')
  done()
})

/**
 * dll文件打包
 */
gulp.task('dll', function (done) {
  const makefile = () => {
    webpackRun(require('./build/webpack.dll.config'), function () {
      console.log('Dll compiled successfully')
      done()
    })
  }

  // 线上构建时 每次都重新生成dll相关文件 !important!
  if (process.env.NODE_ENV === 'production') {
    makefile()
    return
  }

  // 本地开发时 文件缓存检测
  fs.readdir(`${OUTPUT_PATH}assets/js/`)
    .then((files) => {
      let flag = false
      for (let i = 0; i < files.length; i++) {
        if (/react_vendor_.*\.js$/.test(files[i])) {
          // 检测到react_vendor.js文件后，再检测react_vendor.manifest.json文件
          if (fs.existsSync(`${OUTPUT_PATH}react_vendor.manifest.json`)) {
            console.log('+++Exits cached: react_vendor.js & react_vendor.manifest.json')
            flag = true
            done()
            return
          }
        }
      }

      if (!flag) {
        makefile()
      }
    })
    .catch(makefile)
})

gulp.task(
  'react',
  gulp.series('clean', 'dll', function (done) {
    webpackRun(require('./build/webpack.config'), done)
  })
)

gulp.task('react-server-clean', function (done) {
  fs.removeSync(REACT_SERVER_DIST)
  done()
})

gulp.task('copy-react-server-resources', function () {
  // 拷贝server需要的资源
  return gulp
    .src(
      [
        '.*',
        '*.*',
        `${OUTPUT_PATH}/loadable-stats.json`,
        `${OUTPUT_PATH}/assets/**/*`, // jsxViewEngine里实现inline js和inline css需要
        `${NODE_VIEW_DIST_DIR}/**/*`,
      ],
      { base: '.' }
    )
    .pipe(gulp.dest(REACT_SERVER_DIST))
})

gulp.task(
  'react-server',
  gulp.series('react-server-clean', 'copy-react-server-resources', function (done) {
    // webpack 编译服务端代码
    const webpackServerConfig = require('./build/webpack.server.config')
    webpackRun(webpackServerConfig, done)
  })
)

// http://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/
function cleanCache(modulePath) {
  const module = require.cache[modulePath]
  delete require.cache[modulePath]
  // remove reference in module.parent
  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(module), 1)
  }
}

gulp.task('dev-server', function () {
  const server = express()
  let app
  let initialized
  const webpackServerConfig = require('./build/webpack.server.config')
  const { output } = webpackServerConfig
  const outputFilePath = path.join(output.path, output.filename)
  webpackCli(webpackServerConfig).watch(300, function (error, stats) {
    if (error) {
      throw error
    }

    if (!stats.hasErrors()) {
      if (initialized) {
        cleanCache(outputFilePath)
        app = require(outputFilePath)
      } else {
        console.log(`starting ${output.filename} at ${new Date().toLocaleString()}`)

        app = require(outputFilePath)
        server.use((req, res, next) => {
          app.handle(req, res, next)
        })

        const defaultApiDomain = 'http://api.dd.com'
        const apiMap = {
          'm.hutaojie.com': 'http://apiv2.hutaojie.com',
        }

        require('@pdd/dev-tool')(server, {
          // 开发环境的路由，一般用于配置assets路径，可配多个
          addRoutes: {
            '/assets': express.static(path.join(process.cwd(), 'dist/assets')),
          },

          // 传入开发环境的webpackConfig，可实现devServer和HMR功能
          webpackConfig: require('./build/webpack.dev.config'),

          // useMock: true,
          // mock配置，不传入则默认寻找 `mock/config` 作为配置
          // mockConfig: require('./mock/config')

          // https的端口，传入则启用https，并以该端口监听https。可使用环境变量HTTPS_PORT注入
          // httpsPort: 3001,

          // 构建完成后自动打开浏览器，可选。默认打开第一个html页面
          // autoOpenBrowser: {
          //     pathname: 'charge_video.html',
          //     search: '__csr',
          //     hash: '#wechat_redirect'
          // },
          autoOpenBrowser: false, // 关闭自动打开浏览器
          proxyConfig: {
            '/proxy/api': {
              target: 'http://127.0.0.1',
              changeOrigin: true,
              pathRewrite: { '^/proxy/api': '' },
              proxyTimeout: 1200,
              router(req) {
                return apiMap[req.hostname] || defaultApiDomain // overwrite target
              },
            },
          },
        })

        const port = parseInt(process.env.PORT, 10) || 8882
        server.listen(port, () => {
          console.log(`server is listening on port: ${port}`)
        })

        initialized = true
      }
    } else {
      if (!initialized) {
        throw new Error(stats.toString())
      }
    }
  })
})

gulp.task('dev', gulp.series('dll', 'dev-server'))
