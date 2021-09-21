/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint no-var: 0 */
const webpack = require('webpack')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const WORKSPACE = path.resolve(__dirname, '../')

function resolve(...args) {
  return path.resolve(__dirname, ...args)
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'node',
  entry: [resolve('../app.js')],
  resolve: {
    alias: {
      '@benz': path.join(WORKSPACE, '@benz'),
      src: path.join(WORKSPACE, 'src'),
      '@': path.join(WORKSPACE, 'src'),
    },
  },
  output: {
    path: path.join(__dirname, '../dist/server'),
    filename: 'app.js',
    libraryTarget: 'commonjs2',
  },
}
