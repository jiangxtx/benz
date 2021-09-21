/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')

const WORKSPACE = path.resolve(__dirname, '../')
const outputPath = path.join(WORKSPACE, 'dist/')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: {
    react_vendor: [
      'react',
      'react-dom',
      'prop-types',
      'classnames',
      'core-js/es6/map',
      'core-js/es6/set',
      'create-react-class',
    ],
  },
  output: {
    publicPath: '',
    path: outputPath,
    filename: 'assets/js/[name]_[chunkhash].js',
    /**
     * 对于用途广泛的 library，我们希望它能够兼容不同的环境，例如 CommonJS，AMD，Node.js 或者作为一个全局变量.
     * 为了让你的 library 能够在各种用户环境(consumption)中可用，需要在 output 中添加 library 属性.
     */
    library: '[name]_library',
    /* 为了让 library 和其他环境兼容，还需要在配置文件中添加 libraryTarget 属性。这是可以控制 library 如何以不同方式暴露的选项。 */
    libraryTarget: 'commonjs2',
  },
  optimization: {},
  resolve: {
    alias: {
      '@benz': path.join(WORKSPACE, '@benz'),
    },
  },
  plugins: [
    new webpack.DllPlugin({
      path: outputPath + 'react_vendor.manifest.json',
      name: '[name]_library',
    }),
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
    /* 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境 */
    new webpack.NameModulesPlugin(),
  ],
}
